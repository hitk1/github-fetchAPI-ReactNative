export default class RepositorySchema {
    static schema = {
        name: 'Repository',  //Define o nome do schema que sera criado no realm
        primaryKey: 'id',
        properties: {       //Resume-se nos atributos desse schema
            id: { type: 'int', indexed: true},
            name: 'string',
            fullName: 'string',
            description: 'string',
            stars: 'int',
            forks: 'int'
        }

    }
}