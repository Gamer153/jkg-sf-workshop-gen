interface WorkshopR {
    id: number;
    name: string;
    leader: string;
    duration: 90 | 120;
    max_members: number;
}
export type Workshop = Readonly<WorkshopR>

enum Status {
    NORMAL = "-",
    WORKSHOP_LEADER = "wlead",
    ABSENT = "abs",
    FESTIVAL_MANAGEMENT = "mgmt"
}

interface SPupilR {
    surname: string;
    first_name: string;
    gender: "m" | "w" | "d";
    sleeping: boolean;
    paid: boolean;
    gets_food: boolean;
    status: Status;
    /**
     * will be undefined if status == Status.NORMAL
     */
    wishes?: [Workshop, Workshop, Workshop];
}
export type SPupil = Readonly<SPupilR>

interface SClassR {
    name: string;
    pupils: SPupil[];
    room: string;
}
export type SClass = Readonly<SClassR>

interface DPupilR extends Readonly<Omit<SPupil, "wishes">> {
    workshop: Workshop;
}
export type DPupil = Readonly<DPupilR>

interface DClassR extends Readonly<SClass> {
    pupils: DPupil[];
}
export type DClass = Readonly<DClassR>
