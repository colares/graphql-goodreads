const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString
} = require('graphql')

// promise-chaining: https://javascript.info/promise-chaining

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '...',

    fields: () => ({
        name: {
            type: GraphQLString,
            // the resolve function helps the AuthorType to know
            // how to fetch the data properly from the XML monster
            // this time, there're no arguments
            // author and name are multiple. remember
            resolve: xml => xml.GoodreadsResponse.author[0].name[0]
        }      
    })
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: { type: GraphQLInt}
                },
                // function that graphql will use to fetch the data
                // from author
                // (1 arg) --> parent data
                // (2 arg) --> args. sent payload
                resolve: (root, args) => fetch(
                    `https://www.goodreads.com/author/show.xml?id=${args.id}&key=blabla`
                )
                .then(response => response.text())
                .then(parseXML)
            }
        })
    })
})