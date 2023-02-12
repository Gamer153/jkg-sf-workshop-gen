import { SClass, SPupil, Status, Workshop } from "./data";
import Excel from "exceljs";

export function readWorkshops(sheet: Excel.Worksheet): [workshops: Map<number, Workshop>, warnings: string[], error: string | null] {
    const workshops = new Map<number, Workshop>();
    const warnings = [];
    for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        const id = parseInt(row.getCell("A").text);
        if (isNaN(id)) continue;
        const wName = row.getCell("B").text;
        if (wName.trim() == "") {
            warnings.push(`Workshop mit ID ${id} (in Zeile ${i}) hat keinen Namen! Übersprungen.`)
            continue;
        }
        const wLeader = row.getCell("C").text;
        if (wLeader.trim() == "") return [workshops, warnings, `Workshop \"${wName}\" (in Zeile ${i}) hat keine*n Leiter*in!`];
        const wLClass = row.getCell("D").text;
        if (wLClass.trim() == "") return [workshops, warnings, `Klasse des/der Leiter*in fehlt bei Workshop \"${wName}\" (in Zeile ${i})!`];
        const wMaxMembers = parseInt(row.getCell("E").text);
        if (isNaN(wMaxMembers) || wMaxMembers < 1) return [workshops, warnings, "Workshop \"${wName}\" (in Zeile ${i}) hat keine gültige maximale Teilnehmerzahl!"];
        const wDuration = parseInt(row.getCell("F").text);
        if (isNaN(wDuration) || (wDuration != 90 && wDuration != 120)) return [workshops, warnings, `Workshop \"${wName}\" (in Zeile ${i}) muss entweder 90 oder 120 min Dauer haben!`];
        workshops.set(id, {
            id,
            name: wName,
            leader: wLeader,
            leaderClass: wLClass,
            maxMembers: wMaxMembers,
            duration: wDuration
        });
    }
    return [workshops, warnings, null];
}

export function readClasses(sheet: Excel.Worksheet): SClass[] {
    // TODO: this!
    return [
        {
            name: "JG11",
            room: "209",
            pupils: [
                {
                    surname: "Albert",
                    firstName: "Antonio",
                    klasse: "kl",
                    gender: "m",
                    sleeping: true,
                    paid: true,
                    getsFood: true,
                    status: Status.WORKSHOP_LEADER
                },
                {
                    surname: "Becker",
                    firstName: "Kevin",
                    klasse: "kl",
                    gender: "m",
                    sleeping: false,
                    paid: true,
                    getsFood: true,
                    status: Status.WORKSHOP_LEADER
                },
                {
                    surname: "Maurizio",
                    firstName: "Brückner",
                    klasse: "kl",
                    gender: "m",
                    sleeping: true,
                    paid: true,
                    getsFood: false,
                    status: Status.WORKSHOP_LEADER
                },
                {
                    surname: "Manthey",
                    firstName: "Felix",
                    klasse: "kl",
                    gender: "m",
                    sleeping: true,
                    paid: true,
                    getsFood: true,
                    status: Status.WORKSHOP_LEADER
                },
                {
                    surname: "Böckel",
                    firstName: "Johanna",
                    klasse: "kl",
                    gender: "w",
                    sleeping: true,
                    paid: true,
                    getsFood: true,
                    status: Status.FESTIVAL_MANAGEMENT
                },
            ]
        },
        {
            name: "7-1",
            room: "305",
            pupils: [
                {
                    surname: "Albert",
                    firstName: "Jussl",
                    klasse: "kl",
                    gender: "m",
                    sleeping: true,
                    paid: true,
                    getsFood: true,
                    status: Status.NORMAL,
                    wishes: [2, 4, 1]
                },
                {
                    surname: "Soundso",
                    firstName: "Mohammed",
                    klasse: "kl",
                    gender: "m",
                    sleeping: false,
                    paid: true,
                    getsFood: true,
                    status: Status.NORMAL,
                    wishes: [3, 1, 4]
                },
                {
                    surname: "Whatever",
                    firstName: "Hannah",
                    klasse: "kl",
                    gender: "w",
                    sleeping: true,
                    paid: true,
                    getsFood: false,
                    status: Status.NORMAL,
                    wishes: [4, 2, 3]
                },
                {
                    surname: "Theone",
                    firstName: "Dana",
                    klasse: "kl",
                    gender: "w",
                    sleeping: true,
                    paid: false,
                    getsFood: true,
                    status: Status.NORMAL,
                    wishes: [4, 1, 2]
                },
                {
                    surname: "Itsame",
                    firstName: "Joma",
                    gender: "m",
                    sleeping: true,
                    klasse: "kl",
                    paid: true,
                    getsFood: true,
                    status: Status.NORMAL,
                    wishes: [3, 4, 2]
                },
                {
                    surname: "Ulhalt Enkann",
                    firstName: "Weiler Netseima",
                    gender: "m",
                    sleeping: false,
                    klasse: "kl",
                    paid: false,
                    getsFood: false,
                    status: Status.NORMAL,
                    wishes: [4, 3, 1]
                }
            ]
        }
    ]
}

export function getPupilsFromClasses(classes: SClass[]): SPupil[] {
    return classes.flatMap((val) => val.pupils)
}
