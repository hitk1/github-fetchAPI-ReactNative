import Realm from 'realm'
// Importando Schema dos repositorios
import RepositorySchema from '../schemas/RepositorySchema'

//Exporta a função que servirá como generic para abrir conexão com todo schema existente
export default function getRealm(){
    return Realm.open({
        schema: [RepositorySchema],     //Passa no array todos os schemas desejados
    })
}