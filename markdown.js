const data = require('./struct_credits.json')
var TurndownService = require('turndown')

var turndownService = new TurndownService()

for (d of data) {
    const auteur = require(`./json/acteur/${d.auteur}.json`)
    const groupe = require(`./json/organe/${d.groupe}.json`)

    console.log(`# Amendement ${d.numero}`)
    console.log(`🧑 Déposé par ${auteur.acteur.etatCivil.ident.prenom} ${auteur.acteur.etatCivil.ident.nom} (${groupe.organe.libelleAbrev})\n`)
    console.log(`👉 Affecte la mission ${d.mission}\n`)
    const retraits = d.chgtCredits.filter(x => parseInt(x.cp) < 0).map(x => `**${Math.abs(parseInt(x.cp)).toLocaleString('fr-FR')}€** de crédits de paiement au programme **\"${x.libelle}\"**`).join(", ");
    const ajouts = d.chgtCredits.filter(x => parseInt(x.cp) > 0).map(x => `**${Math.abs(parseInt(x.cp)).toLocaleString('fr-FR')}€** de crédits de paiement au programme **\"${x.libelle}\"**`).join(", ");

    console.log(`↘️ Retire ${retraits}\n`)
    console.log(`↗️ Au profit de ${ajouts}\n`)

    console.log(`## Exposé des motifs`)
    console.log(turndownService.turndown(d.expose))
    console.log('\n---\n')
}
