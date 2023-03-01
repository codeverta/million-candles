export const toCurrency = (number: number): String => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
}

export const getRelationship = (root: any, resource: any, relation: string): any => {
    return root.included.find((include: any) => include.id === resource.relationships[relation].data.id);
}

export const getRelationships = (root: any, resource: any, relation: string): any => {
    return resource.relationships[relation].data.map((it: { id: string, type: string}) => { 
        return root.included.find((include: any) => include.id === it.id)
    })
}

