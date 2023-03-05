import { SClass, SPupil, Status, Workshop } from "./data";
import Excel from "exceljs";

export enum WorkshopColumnType {
    id = "Workshop-ID", name = "Workshop-Name", leaderName = "Leiter-Name", leaderClass = "Leiter-Klasse", maxMembers = "Max. Teilnehmer", duration = "Dauer"
}

export function readWorkshops(sheet: Excel.Worksheet, rowMapping: Map<WorkshopColumnType, string>, autoGenIdIfMissing: boolean = true): [workshops: Map<number, Workshop>, warnings: string[], error: string | null] {
    const workshops = new Map<number, Workshop>();
    const warnings: string[] = [];

    const error = (error: string) => [workshops, warnings, error] as [Map<number, Workshop>, string[], string | null];

    for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);

        const id = rowMapping.has(WorkshopColumnType.id) ? parseInt(row.getCell(rowMapping.get(WorkshopColumnType.id)!.toUpperCase()).text) : (autoGenIdIfMissing ? i - 1 : NaN);
        if (isNaN(id)) continue;

        const nameMapping = rowMapping.get(WorkshopColumnType.name)?.toUpperCase();
        if (!nameMapping) return error("Kein Mapping für Workshop-Name angegeben!");
        const wName = row.getCell(nameMapping).text;
        if (wName.trim() == "") {
            warnings.push(`Workshop mit ID ${id} (in Zeile ${i}) hat keinen Namen! Übersprungen.`);
            continue;
        }

        const leaderNMapping = rowMapping.get(WorkshopColumnType.leaderName)?.toUpperCase();
        if (!leaderNMapping) return error("Kein Mapping für Leiter-Name angegeben!");
        const wLeader = row.getCell(leaderNMapping).text;
        if (wLeader.trim() == "") return error(`Workshop \"${wName}\" (in Zeile ${i}) hat keine*n Leiter*in!`);

        const leaderCMapping = rowMapping.get(WorkshopColumnType.leaderClass)?.toUpperCase();
        if (!leaderCMapping) return error("Kein Mapping für Leiter-Klasse angegeben!");
        const wLClass = row.getCell(leaderCMapping).text;
        if (wLClass.trim() == "") return error(`Klasse des/der Leiter*in fehlt bei Workshop \"${wName}\" (in Zeile ${i})!`);

        const maxMemMapping = rowMapping.get(WorkshopColumnType.maxMembers)?.toUpperCase();
        if (!maxMemMapping) return error("Kein Mapping für maximale Teilnehmer angegeben!");
        const wMaxMembers = parseInt(row.getCell(maxMemMapping).text);
        if (isNaN(wMaxMembers) || wMaxMembers < 1) return error(`Workshop \"${wName}\" (in Zeile ${i}) hat keine gültige maximale Teilnehmerzahl!`);

        const durationMapping = rowMapping.get(WorkshopColumnType.duration)?.toUpperCase();
        if (!durationMapping) return error("Kein Mapping für Dauer angegeben!");
        const wDuration = parseInt(row.getCell(durationMapping).text);
        if (isNaN(wDuration) || (wDuration != 90 && wDuration != 120)) return error(`Workshop \"${wName}\" (in Zeile ${i}) muss entweder 90 oder 120 min Dauer haben!`);

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
