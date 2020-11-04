export interface TableStatsType {
    camps: number;
    awareness: number;
    helpline: number;
    donations: number;
    helplineDonations:number;
    activeVolunteer: number;
    city: string;
}

export interface Event {
    BloodConnect_City: string;
    Date_field: string;
    City_Event: {
        display_value: string;
        ID: string;
    };
    "Organization_Details.Organization_Name": string;
    "Post_Camp_ID.Number_of_Donation": string;
    Camp_Coordinator: {
        display_value: string;
        ID: string;
    };
    ID: string;
    TypeOfEvent: "Camp" | "Awareness";
}

export interface Team {
    Status: string;
    BloodConnect_City: string;
    Email: string;
    Alternate_contact_number: string;
    ID: string;
    Name: {
        display_value: string;
        prefix: string;
        last_name: string;
        suffix: string;
        first_name: string;
    };
    Contact: string;
}


export interface CreatorResponse<T> {
    code: number;
    data: T[];
}
