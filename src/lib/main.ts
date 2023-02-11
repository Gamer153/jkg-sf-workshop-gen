import randomItem from "random-item";
import { DClass, DPupil, DWorkshopMap, SClass, SPupil, Status, Workshop } from "./data";
import { getPupilsFromClasses, readClasses, readWorkshops } from "./loader";

function filterWorkshop(members: SPupil[], maxMembers: number) {
    const removed = [] as SPupil[];
    while (members.length > maxMembers) {
        const p = randomItem(members);
        members = members.filter((m) => m != p);
        removed.push(p);
    }
    return [removed, members];
}

function process(classes: SClass[], workshops: { [id: number]: Workshop }): [DClass[] | null, DWorkshopMap | null, string[]] {
    const errors: string[] = [];

    const pupils = getPupilsFromClasses(classes).map((p) => ({ ...p, toString: () => `${p.firstName} ${p.surname}` }));

    const workshopMap = new Map<number, SPupil[]>();
    const addToWorkshop = (id: number, pupil: SPupil) => {
        const oldList = workshopMap.get(id) ?? [];
        oldList.push(pupil);
        workshopMap.set(id, oldList);
    };

    pupils.forEach((pupil) => {
        if (pupil.status != Status.NORMAL) return;
        if (!pupil.wishes) {
            errors.push(`${pupil} did not have any wishes, even though they are \"normal\"!`);
            return;
        }
        addToWorkshop(pupil.wishes[0], pupil);
    });
    if (errors.length > 0) return [null, null, errors];

    const generateTryProcessor = (what_try: number) =>
        () => workshopMap.forEach((curMembers, id) => {
            const [removed, members] = filterWorkshop(curMembers, workshops[id].maxMembers);
            removed.forEach((pupil) => {
                if (!pupil.wishes) return;
                addToWorkshop(pupil.wishes[what_try], pupil);
            });

            workshopMap.set(id, members);
        });
    
    generateTryProcessor(1)(); // rearrange people into their second wish
    generateTryProcessor(2)(); // ...then into their third wish

    const notAssignable = []; // TODO: filter still full workshops, assign random pupils to random other workshops that still have space

    [...(workshopMap.entries())].sort((a, b) => a[0] - b[0]).forEach(([id, members]) => {
        console.log(`${id}:${members.map((m) => " " + m.toString())} (${members.length})`)
    })

    const finalizedWorkshopMap = new Map<Workshop, DPupil>();

    return [null, finalizedWorkshopMap, errors];
}
