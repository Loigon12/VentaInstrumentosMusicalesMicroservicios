using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using POCInstrumentoCuerda.model;

namespace POCInstrumentoCuerda
{
    internal static class GraphQLService
    {
        private const string Endpoint = "http://localhost:8081/graphql";

        private static GraphQLHttpClient CreateClient()
        {
            return new GraphQLHttpClient(Endpoint, new SystemTextJsonSerializer());
        }

        public static async Task<List<Instrumento>> ListarAsync(string nombre, double? precioMaximo)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendQueryAsync<InstrumentoQueryResponse>(new GraphQLRequest
                {
                    Query = "query ($nombre: String, $precioMaximo: Float) { instrumento(nombre: $nombre, precioMaximo: $precioMaximo) { id nombre precio fechaVenta numeroCuerdas numeroTrastes accesorio { id } } }",
                    Variables = new { nombre, precioMaximo }
                });
                Validate(response.Errors);
                return response.Data.instrumento ?? new List<Instrumento>();
            }
        }

        public static async Task<Instrumento> BuscarAsync(int id)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendQueryAsync<InstrumentoQueryResponse>(new GraphQLRequest
                {
                    Query = "query ($codigo: Int!) { instrumentoPorCodigo(codigo: $codigo) { id nombre precio fechaVenta numeroCuerdas numeroTrastes } }",
                    Variables = new { codigo = id }
                });
                Validate(response.Errors);
                return response.Data.instrumentoPorCodigo;
            }
        }

        public static async Task<Instrumento> AdicionarAsync(InstrumentoInput input)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendMutationAsync<InstrumentoMutationResponse>(new GraphQLRequest
                {
                    Query = "mutation ($input: InstrumentoInput!) { addInstrumento(input: $input) { id nombre precio fechaVenta numeroCuerdas numeroTrastes } }",
                    Variables = new { input }
                    
                });
                Validate(response.Errors);
                if (response.Data.addInstrumento != null) ServicioObserver.NotificarCambio();
                return response.Data.addInstrumento;
            }
        }

        public static async Task<Instrumento> EliminarAsync(int id)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendMutationAsync<InstrumentoMutationResponse>(new GraphQLRequest
                {
                    Query = "mutation ($id: Int!) { delInstrumento(input: $id) { id nombre precio fechaVenta numeroCuerdas numeroTrastes } }",
                    Variables = new { id }
                });
                Validate(response.Errors);
                if (response.Data.delInstrumento != null) ServicioObserver.NotificarCambio();
                return response.Data.delInstrumento;
            }
        }

        public static async Task<Instrumento> ActualizarAsync(InstrumentoInput input)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendMutationAsync<InstrumentoMutationResponse>(new GraphQLRequest
                {
                    Query = "mutation ($input: InstrumentoInput!) { editInstrumento(input: $input) { id nombre precio fechaVenta numeroCuerdas numeroTrastes } }",
                    Variables = new { input }
                });
                Validate(response.Errors);
                if (response.Data.editInstrumento != null) ServicioObserver.NotificarCambio();
                return response.Data.editInstrumento;
            }
        }

        public static async Task<List<Accesorio>> ListarAccesoriosAsync()
        {
            using (var client = CreateClient())
            {
                var response = await client.SendQueryAsync<AccesorioQueryResponse>(new GraphQLRequest
                {
                    Query = "{ accesorio { id nombre tipo precio marca idInstrumento } }"
                });
                Validate(response.Errors);
                return response.Data.accesorio ?? new List<Accesorio>();
            }
        }

        public static async Task<Accesorio> BuscarAccesorioAsync(int id)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendQueryAsync<AccesorioQueryResponse>(new GraphQLRequest
                {
                    Query = "query($codigo:Int!){ accesorioPorCodigo(codigo:$codigo){ id nombre tipo precio marca idInstrumento } }",
                    Variables = new { codigo = id }
                });
                Validate(response.Errors);
                return response.Data.accesorioPorCodigo;
            }
        }

        public static async Task<Accesorio> AdicionarAccesorioAsync(AccesorioInput input)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendMutationAsync<AccesorioMutationResponse>(new GraphQLRequest
                {
                    Query = "mutation($input:AccesorioCuerdaInput!){ addAccesorio(input:$input){ id nombre tipo precio marca idInstrumento } }",
                    Variables = new { input }
                });
                Validate(response.Errors);
                if (response.Data.addAccesorio != null) ServicioObserver.NotificarCambio();
                return response.Data.addAccesorio;
            }
        }

        public static async Task<Accesorio> EliminarAccesorioAsync(int id)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendMutationAsync<AccesorioMutationResponse>(new GraphQLRequest
                {
                    Query = "mutation($id:Int!){ delAccesorio(input:$id){ id nombre tipo precio marca idInstrumento } }",
                    Variables = new { id }
                });
                Validate(response.Errors);
                if (response.Data.delAccesorio != null) ServicioObserver.NotificarCambio();
                return response.Data.delAccesorio;
            }
        }

        public static async Task<Accesorio> ActualizarAccesorioAsync(AccesorioInput input)
        {
            using (var client = CreateClient())
            {
                var response = await client.SendMutationAsync<AccesorioMutationResponse>(new GraphQLRequest
                {
                    Query = "mutation($input:AccesorioCuerdaInput!){ editAccesorio(input:$input){ id nombre tipo precio marca idInstrumento } }",
                    Variables = new { input }
                });
                Validate(response.Errors);
                if (response.Data.editAccesorio != null) ServicioObserver.NotificarCambio();
                return response.Data.editAccesorio;
            }
        }

        private static void Validate(GraphQLError[] errors)
        {
            if (errors != null && errors.Length > 0)
                throw new InvalidOperationException(string.Join(Environment.NewLine, errors.Select(error => error.Message)));
        }
    }
}
