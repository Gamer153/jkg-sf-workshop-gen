import { SClass, SPupil, Status, Workshop } from "./data";

export function readWorkshops(filename: string): { [id: number]: Workshop } {
    // TODO: do this lol
    return {
        1: {
            id: 1,
            name: "Kevins Kochshow",
            leader: "Kevin Bäcker",
            duration: 90,
            maxMembers: 2
        },
        2: {
            id: 2,
            name: "Mauzis mildes Mitmachtheater",
            leader: "Maurizio Brückner",
            duration: 120,
            maxMembers: 3
        },
        3: {
            id: 3,
            name: "Antonios anderes Angebot",
            leader: "Antonio Albert",
            duration: 120,
            maxMembers: 1
        },
        4: {
            id: 4,
            name: "Felix' feine Filmwerkstatt",
            leader: "Felix Manthey",
            duration: 120,
            maxMembers: 2
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
