interface WorkshopR {
    id: number;
    name: string;
    leader: string;
    duration: 90 | 120;
    max_members: number;
}
export type Workshop = Readonly<WorkshopR>

export enum Status {
    NORMAL = "normal",
    WORKSHOP_LEADER = "wlead",
    ABSENT = "abs",
    FESTIVAL_MANAGEMENT = "mgmt"
}

interface SPupilR {
    surname: string;
    first_name: string;
    gender: "m" | "w" | "d";
    klasse: string;
    sleeping: boolean;
    paid: boolean;
    gets_food: boolean;
    status: Status;
    /**
     * will be undefined if status != Status.NORMAL
     */
    wishes?: [number, number, number];
}
export type SPupil = Readonly<SPupilR>

interface SClassR {
    name: string;
    pupils: SPupil[];
    room: string;
}
export type SClass = Readonly<SClassR>

interface DPupilR extends Readonly<Omit<SPupil, "wishes">> {
    /**
     * will be undefined if status == Status.FESTIVAL_MANAGEMENT
     */
    workshop?: Workshop;
}
export type DPupil = Readonly<DPupilR>

interface DClassR extends Readonly<SClass> {
    pupils: DPupil[];
}
export type DClass = Readonly<DClassR>
