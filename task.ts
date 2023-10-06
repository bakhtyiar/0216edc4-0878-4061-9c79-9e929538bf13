// ***************************
// TYPES
// ***************************

type TNodeId = string | number;

interface INode {
    id: TNodeId,
    parent: TNodeId,
    type?: any
}

// ***************************
// CLASS
// ***************************

class TreeStore {
    // Because required init data arr on getAll(), i'm added prop initArr
    public initArr: INode[];
    private nodeMap: Map<string | number, INode>;
    private childMap: Map<string | number, INode[]>;
    private parentMap: Map<string | number, INode>;

    constructor(data: INode[]) {
        this.initArr = data;
        this.nodeMap = new Map();
        this.childMap = new Map();
        this.parentMap = new Map();

        data.forEach((node) => {
            this.nodeMap.set(node.id, node);

            if (node.parent) {
                if (!this.childMap.get(node.parent)) {
                    this.childMap.set(node.parent, []);
                }
                this.childMap.get(node.parent)!.push(node);
                this.parentMap.set(node.id, this.nodeMap.get(node.parent)!);
            }
        });
    }

    getAll() {
        return this.initArr;
    }

    getItem(id: TNodeId) {
        return this.nodeMap.get(id);
    }

    getChildren(id: TNodeId) {
        return this.childMap.get(id) || [];
    }

    getAllChildren(id: TNodeId) {
        let allChildren: INode[] = [];

        let childrenPool = [...this.getChildren(id)];
        while (childrenPool.length) {
            let tempPool: INode[] = [];

            childrenPool.forEach((child) => {
                tempPool.push(...this.getChildren(child.id));
                allChildren.push(child);
            })

            childrenPool = tempPool;
        }

        return allChildren;
    }

    getParent(id: TNodeId) {
        return this.parentMap.get(id);
    }

    getAllParents(id: TNodeId) {
        let parents: INode[] = [];

        let currentParent = this.getParent(id);
        if (currentParent) parents.push(currentParent!);

        while (currentParent) {
            const possibleParent = this.getParent(currentParent.id);
            if (possibleParent) parents.push(possibleParent!);
            currentParent = possibleParent;
        }

        return parents;
    }
}

const items: INode[] = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];
const ts = new TreeStore(items);

// ***************************
// TESTS
// ***************************

let expected: any = items
let got: any = ts.getAll()
console.log('getAll() works right:', expected === got);

expected = { "id": 7, "parent": 4, "type": null }
got = ts.getItem(7)
console.log('getItem(7) works right: ', JSON.stringify(expected) === JSON.stringify(got));

expected = [{ "id": 7, "parent": 4, "type": null }, { "id": 8, "parent": 4, "type": null }]
got = ts.getChildren(4)
console.log('getChildren(4) works right: ', JSON.stringify(expected) === JSON.stringify(got));

expected = []
got = ts.getChildren(5)
console.log('getChildren(5) works right: ', JSON.stringify(expected) === JSON.stringify(got));

expected = [{ "id": 4, "parent": 2, "type": "test" }, { "id": 5, "parent": 2, "type": "test" }, { "id": 6, "parent": 2, "type": "test" }]
got = ts.getChildren(2)
console.log('getChildren(2) works right: ', JSON.stringify(expected) === JSON.stringify(got));

expected = [{ "id": 4, "parent": 2, "type": "test" }, { "id": 5, "parent": 2, "type": "test" }, { "id": 6, "parent": 2, "type": "test" }, { "id": 7, "parent": 4, "type": null }, { "id": 8, "parent": 4, "type": null }]
got = ts.getAllChildren(2)
console.log('getAllChildren(2) works right: ', JSON.stringify(expected) === JSON.stringify(got));

expected = [{ "id": 4, "parent": 2, "type": "test" }, { "id": 2, "parent": 1, "type": "test" }, { "id": 1, "parent": "root" }]
got = ts.getAllParents(7)
console.log('getAllParents(7) works right: ', JSON.stringify(expected) === JSON.stringify(got));