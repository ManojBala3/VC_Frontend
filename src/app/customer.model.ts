export class Customer{
    public id: number;
    public name: string | undefined;
    public email: string | undefined;
    public phoneNumber: number | undefined;
    public address: string | undefined;
    public state: string | undefined;
    public district: string | undefined;
    public zipCode: number;

    constructor(id:number, name: string, email: string, phoneNumber: number, address: string, state: string, district: string, zipCode: number){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.state = state;
        this.district = district;
        this.zipCode = zipCode;
    }
}

