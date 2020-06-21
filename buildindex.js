var index = 
{
    "name": "activities",
    "fields": [
      {
        "name": "id",
        "type": "Edm.String",
        "facetable": false,
        "filterable": false,
        "key": true,
        "retrievable": true,
        "searchable": false,
        "sortable": false,
        "analyzer": null,
        "indexAnalyzer": null,
        "searchAnalyzer": null,
        "synonymMaps": [],
        "fields": []
      },
      {
        "name": "title",
        "type": "Edm.String",
        "facetable": false,
        "filterable": true,
        "key": false,
        "retrievable": true,
        "searchable": true,
        "sortable": true,
        "analyzer": "standard.lucene",
        "indexAnalyzer": null,
        "searchAnalyzer": null,
        "synonymMaps": [],
        "fields": []
      },
      {
        "name": "when",
        "type": "Edm.DateTimeOffset",
        "facetable": false,
        "filterable": true,
        "retrievable": true,
        "sortable": true,
        "analyzer": null,
        "indexAnalyzer": null,
        "searchAnalyzer": null,
        "synonymMaps": [],
        "fields": []
      },
      {
        "name": "description",
        "type": "Edm.String",
        "facetable": false,
        "filterable": false,
        "key": false,
        "retrievable": true,
        "searchable": true,
        "sortable": false,
        "analyzer": "standard.lucene",
        "indexAnalyzer": null,
        "searchAnalyzer": null,
        "synonymMaps": [],
        "fields": []
      },
      {
        "name": "segments",
        "type": "Collection(Edm.String)",
        "facetable": true,
        "filterable": true,
        "retrievable": true,
        "searchable": true,
        "analyzer": "standard.lucene",
        "indexAnalyzer": null,
        "searchAnalyzer": null,
        "synonymMaps": [],
        "fields": []
      },
      {
        "name": "cities",
        "type": "Collection(Edm.String)",
        "facetable": true,
        "filterable": true,
        "retrievable": true,
        "searchable": true,
        "analyzer": "standard.lucene",
        "indexAnalyzer": null,
        "searchAnalyzer": null,
        "synonymMaps": [],
        "fields": []
      },
      {
        "name": "athlete",
        "type": "Edm.Int32",
        "facetable": false,
        "filterable": true,
        "retrievable": true,
        "sortable": false,
        "analyzer": null,
        "indexAnalyzer": null,
        "searchAnalyzer": null,
        "synonymMaps": [],
        "fields": []
      }
    ],
    "suggesters": [
      {
        "name": "main",
        "searchMode": "analyzingInfixMatching",
        "sourceFields": [
          "title",
          "description",
          "segments"
        ]
      }
    ],
    "scoringProfiles": [],
    "defaultScoringProfile": "",
    "corsOptions": {
      "allowedOrigins": [
        "*"
      ],
      "maxAgeInSeconds": 300
    },
    "analyzers": [],
    "charFilters": [],
    "tokenFilters": [],
    "tokenizers": [],
    "@odata.etag": "\"0x8D8145F214F6E0A\""
  }


async function main() {

    const { SearchIndexClient , AzureKeyCredential } = require("@azure/search-documents");
 
    const client = new SearchIndexClient ("https://search-strava.search.windows.net", new AzureKeyCredential(process.env.SEARCH_KEY));
   


    const result = await client.createIndex( index );
    
    console.log(result);

}

main().catch( e => console.log(e));