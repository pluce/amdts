const data = require('./struct_credits.json')
var TurndownService = require('turndown')

var turndownService = new TurndownService()

const csvData = []
csvData.push([
    "Numéro",
    "Auteur",
    "Groupe",
    "Mission",
    "Montant transféré",
    "Programme origine",
    "Programme destination",
    "Exposé des motifs"
])


for (d of data) {

    const auteur = require(`./json/acteur/${d.auteur}.json`)
    const groupe = require(`./json/organe/${d.groupe}.json`)

    const retrait = d.chgtCredits.filter(x => parseInt(x.cp) < 0)[0];
    const ajout = d.chgtCredits.filter(x => parseInt(x.cp) > 0)[0];
    if (!ajout || !retrait) {
        continue
    }

    csvData.push([
        d.numero,
        `${auteur.acteur.etatCivil.ident.prenom} ${auteur.acteur.etatCivil.ident.nom}`,
        groupe.organe.libelleAbrev,
        d.mission,
        Math.abs(parseInt(retrait.cp)),
        retrait.libelle,
        ajout.libelle,
        turndownService.turndown(d.expose)
    ])
}

const { stringify } = require('csv-stringify/sync');

const output = stringify(csvData);

console.log(output)