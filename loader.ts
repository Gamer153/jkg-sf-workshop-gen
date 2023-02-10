import { SClass, SPupil, Status, Workshop } from "./data.ts";

export function readWorkshops(filename: string): { [id: number]: Workshop } {
    // TODO: do this lol
    return {
        1: {
            id: 1,
            name: "Kevins Kochshow",
            leader: "Kevin Bäcker",
            duration: 90,
            max_members: 2
        },
        2: {
            id: 2,
            name: "Mauzis mildes Mitmachtheater",
            leader: "Maurizio Brückner",
            duration: 120,
            max_members: 3
        },
        3: {
            id: 3,
            name: "Antonios anderes Angebot",
            leader: "Antonio Albert",
            duration: 120,
            max_members: 1
        },
        4: {
            id: 4,
            name: "Felix' feine Filmwerkstatt",
            leader: "Felix Manthey",
            duration: 120,
            max_members: 2
        }
    }
}

export function readClasses(filename: string): SClass[] {
    // TODO: this!
    return [
        {
            name: "JG11",
            room: "209",
            pupils: [
                {
                    surname: "Albert",
                    first_name: "Antonio",
                    klasse: "kl",
                    gender: "m",
                    sleeping: true,
                    paid: true,
                    gets_food: true,
                    status: Status.WORKSHOP_LEADER
                },
                {
                    surname: "Becker",
                    first_name: "Kevin",
                    klasse: "kl",
                    gender: "m",
                    sleeping: false,
                    paid: true,
                    gets_food: true,
                    status: Status.WORKSHOP_LEADER
                },
                {
                    surname: "Maurizio",
                    first_name: "Brückner",
                    klasse: "kl",
                    gender: "m",
                    sleeping: true,
                    paid: true,
                    gets_food: false,
                    status: Status.WORKSHOP_LEADER
                },
                {
                    surname: "Manthey",
                    first_name: "Felix",
                    klasse: "kl",
                    gender: "m",
                    sleeping: true,
                    paid: true,
                    gets_food: true,
                    status: Status.WORKSHOP_LEADER
                },
                {
                    surname: "Böckel",
                    first_name: "Johanna",
                    klasse: "kl",
                    gender: "w",
                    sleeping: true,
                    paid: true,
                    gets_food: true,
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
                    first_name: "Jussl",
                    klasse: "kl",
                    gender: "m",
                    sleeping: true,
                    paid: true,
                    gets_food: true,
                    status: Status.NORMAL,
                    wishes: [2, 4, 1]
                },
                {
                    surname: "Soundso",
                    first_name: "Mohammed",
                    klasse: "kl",
                    gender: "m",
                    sleeping: false,
                    paid: true,
                    gets_food: true,
                    status: Status.NORMAL,
                    wishes: [3, 1, 4]
                },
                {
                    surname: "Whatever",
                    first_name: "Hannah",
                    klasse: "kl",
                    gender: "w",
                    sleeping: true,
                    paid: true,
                    gets_food: false,
                    status: Status.NORMAL,
                    wishes: [4, 2, 3]
                },
                {
                    surname: "Theone",
                    first_name: "Dana",
                    klasse: "kl",
                    gender: "w",
                    sleeping: true,
                    paid: false,
                    gets_food: true,
                    status: Status.NORMAL,
                    wishes: [4, 1, 2]
                },
                {
                    surname: "Itsame",
                    first_name: "Joma",
                    gender: "m",
                    sleeping: true,
                    klasse: "kl",
                    paid: true,
                    gets_food: true,
                    status: Status.NORMAL,
                    wishes: [3, 4, 2]
                },
                {
                    surname: "Ulhalt Enkann",
                    first_name: "Weiler Netseima",
                    gender: "m",
                    sleeping: false,
                    klasse: "kl",
                    paid: false,
                    gets_food: false,
                    status: Status.NORMAL,
                    wishes: undefined
                }
            ]
        }
    ]
}

export function getPupilsFromClasses(classes: SClass[]): SPupil[] {
    return classes.flatMap((val) => val.pupils)
}
