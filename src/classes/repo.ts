export class RepoBrief {
    id: number;
    name: string;
    amount: number;
}

export class RepoDetail extends RepoBrief{
    words:any[];
    constructor (repo:any){
        super();
        this.id=repo.id;
        this.name=repo.name;
        this.amount=repo.amount;
        this.words=repo.words;
    }
}
