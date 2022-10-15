wget https://data.assemblee-nationale.fr/static/openData/repository/16/loi/amendements_div_legis/Amendements.json.zip
wget https://data.assemblee-nationale.fr/static/openData/repository/16/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip

unzip -o Amendements.json.zip
unzip -o AMO10_deputes_actifs_mandats_actifs_organes.json.zip
rm Amendements.json.zip
rm AMO10_deputes_actifs_mandats_actifs_organes.json.zip

echo "" > amdts.jsonl
for i in $(find -f json/DLR5L16N45988/PRJLANR5L16B0273/** -type f); do
    cat $i >> amdts.jsonl
    echo "" >> amdts.jsonl
done
cat amdts.jsonl | grep "lignesCredits" > amdts_credits.jsonl

cat amdts_credits.jsonl| jq -s  "[.[] | {numero: .amendement.identification.numeroLong, groupe: .amendement.signataires.auteur.groupePolitiqueRef, auteur: .amendement.signataires.auteur.acteurRef, type: .amendement.signataires.auteur.typeAuteur, mission: .amendement.pointeurFragmentTexte.missionVisee.libelleMission, chgtCredits: (.amendement.corps.contenuAuteur.dispositifAmdtCreditPLF.listeProgrammes| [.programme[] | {libelle: .libelle, cp: .creditPaiement, ae: .autorisationEngagement}]), expose: .amendement.corps.contenuAuteur.exposeSommaire|@text}]" > struct_credits.json 

rm amdts.jsonl
rm amdts_credits.jsonl

node markdown.js > amdt.md
node csv.js > amdt.csv

rm -rf json
rm struct_credits.json