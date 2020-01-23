import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Repository from '~/components/Repository'
import api from '~/services/api'
import getRealm from '~/services/realm'
import { Container, Title, Form, Input, Submit, List } from './styles';

export default function Main() {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    async function loadRepository(){

      const realm = await getRealm()

      const data = realm.objects('Repository').sorted('stars', true)  //Ordena os repositorios em ordem descrescente

      setRepositories(data)
    }

    loadRepository()
  }, [])

  async function saveRepository(repository) {
    const data = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    }

    
    const realm = await getRealm()


    realm.write(() => {   //Inserindo dados no realmDB
      /*
      O primeiro Parametro é o nome do Schema que sera salvo
      O segundo Parametro são os dados que serão salvos, no caso, o objeto
      E o terceiro, é um ENUM que é usado como um flag para atualização dos registros onde o ID ja existir no RealmDB
         */
      realm.create('Repository', data, Realm.UpdateMode.Modified)
    })

    return data
  }

  async function handleAddRepository() {
    try {
      const response = await api.get(`/repos/${input}`)

      await saveRepository(response.data)
      setError(false)

      setInput('')

      Keyboard.dismiss()

    } catch (error) {
      setError(true)
      console.tron.warn('Deu ruim')
    }
  }

  async function handleRefreshRepository(repository){

    const response = await api.get(`/repos/${repository.fullName}`)

    const data = await saveRepository(response.data)

    //Depois te atualizar os dados do repositorio no realmDB, percorro todos os registros da tela e atualizo também
    setRepositories(repositories.map(rep => (rep.id === data.id ? data : rep)))

  }

  return (
    <Container>
      <Title>Repositórios</Title>

      <Form>
        <Input
          value={input}
          error = { error }
          onChangeText={text => setInput(text)}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Procurar repositórios..." />

        <Submit onPress={handleAddRepository}>
          <Icon name="add" size={22} color="#FFF" />
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={ repositories }
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <Repository data={item} onRefresh={() => handleRefreshRepository(item)} />
        )}
      />
    </Container>
  );
}
