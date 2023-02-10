import { SPupil, Status } from "./data.ts";
import { getPupilsFromClasses, readClasses, readWorkshops } from "./loader.ts";

function process(errorCallback: (error: string) => void) {

    const classes = readClasses("");
    const pupils = getPupilsFromClasses(classes).map((p) => ({ ...p, toString: () => `${p.first_name} ${p.surname}` }));
    const workshops = readWorkshops("");

    const workshopMap = new Map<number, SPupil[]>();
    const addToWorkshop = (id: number, pupil: SPupil) => {
        const oldList = workshopMap.get(id) ?? [];
        oldList.push(pupil);
        workshopMap.set(id, oldList);
    };

    pupils.forEach((pupil) => {
        if (pupil.status != Status.NORMAL) return;
        if (!pupil.wishes) {
            errorCallback(`${pupil} did not have any wishes, even though they are \"normal\"!`);
            return;
        }
        addToWorkshop(pupil.wishes[0], pupil);
    });

    workshopMap.forEach((members, id) => {
        const workshop = workshops[id];
        const removed = [] as SPupil[];
        while (members.length > workshop.max_members) {
            const p = members[randint]
        }
    });

}

if (import.meta.main) {
    process(console.error);
    console.log("The program completed successfully.");
}
