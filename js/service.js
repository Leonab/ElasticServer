angular.module('searchService',[])

.service('searchService',['$q','esFactory',function($q, esFactory){
	var esClient = esFactory({
		host: 'localhost:9200'
	});
	
	if(!esClient)
	 console.log("Error");
	
	this.search = function(searchTerms, resultsPage){
		var deferred = $q.defer();
		
		esClient.search({
			body :{
				query :{
					match : {
						_all : searchTerms
					}
				}
			},
			from: resultsPage*10 
		}).then(function(es_return){
			deferred.resolve(es_return);
		}, function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};
	
	this.formatResults = function(documents){
		var formattedResults = [];
		
		documents.forEach(function(document){
		        
			formattedResults = {
			 name: document._source.name || document._source.user,
			 index: document._index
			
			};
			
			//JSON.stringify(formattedResults)
			//angular.toJson(formattedResults);
			console.log("yolo",formattedResults);
			
		return(formattedResults);
		});
		
	};
}]);
