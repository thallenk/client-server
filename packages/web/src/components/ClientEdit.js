import React, { useEffect, useMemo, useState }from 'react';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag'


const CLIENT = gql`
    query CLIENT($clientId: ID!){
        client(id: $clientId){
            id
            name
            email
        }
    }
`;

const UPDATE_CLIENT = gql`
    mutation UPDATE_CLIENT($id:ID!, $name: String!, $email: String!){
        updateClient(input:{
            id:$id
            name: $name
            email: $email
        }){
            id
            name
            email
        }
    }
`;

export function ClientEdit({ clientId }) {
    const { data } = useQuery(CLIENT, {
        variables: {
            clientId,
        },
        //se nao tiver o clientid eu não rodo a query.
        skip: !clientId,
        //para nao carregar novamente um mesmo client no forms ao clicar no li
        fetchPolicy: 'cache-first'
    });


    const [ updateClient ] = useMutation(UPDATE_CLIENT)


    const initialValues = useMemo(
        () => ({
            name: data?.client.name ?? '',
            email: data?.client.email ?? '',
        }),
        [data]
    );

    const [values, setValues] = useState(initialValues);

    //usando o useEffect para que sempre o initialValues mudar, eu setar o setValues
    useEffect(() => setValues(initialValues), [initialValues]);

    const handleNameChange = (event) => {
        event.persist();
    
        setValues((values) => ({
          ...values,
          name: event.target.value,
        }));
      };
    
      const handleEmailChange = (event) => {
        event.persist();
    
        setValues((values) => ({
          ...values,
          email: event.target.value,
        }));
      };

      
    const handleSubmit = (event) => {
        event.preventDefault();
        updateClient({
          variables: {
            id: clientId,
            name: values.name,
            email: values.email,
          },
        }).then(console.log);
      };
      
      return (
        <form onSubmit={handleSubmit}>
            Atualizar Client
          <fieldset>
            <input type="text" value={values.name} onChange={handleNameChange} />
          </fieldset>
          <fieldset>
            <input type="text" value={values.email} onChange={handleEmailChange} />
          </fieldset>
          <button type="submit">Salvar</button>
        </form>
      );
    }
