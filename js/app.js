angular.module('searchApp',['elasticsearch','ngSanitize'])

.controller('SearchResultsList',['$scope',function($scope){
	
	$scope.searchTerms = null;
	$scope.noResults = false;
	$scope.isSearching = false;
	$scope.resultsPage = 0;
	
	$scope.results={
		searchTerms: null,
		documentCount: null,
		documents: []
	};


//Results

var resetResults = function(){
	$scope.results.documents = [];
	$scope.results.documentCountf = null;
	$scope.noResults = false;
	$scope.resultsPage = 0;
}

	
	$scope.search = function(){
		
	resetResults();
	
	var searchTerms = $scope.searchTerms;
	
	if(searchTerms){
		$scope.results.searchTerms = searchTerms;
	}else{
		return;
	}
	getResults();
};


$scope.getNextPage = function(){
	$scope.resultsPage++;
	getResults();
};


$scope.$watchGroup(['results','noResults','isSearching'],function(){
	var documentCount = $scope.results.documentCount;
	
	if(!documentCount || documentCount<=$scope.results.documents.length || $scope.noResults || $scope.isSearching){
		$scope.canGetNextPage = false;
	}
	else{
		$scope.canGetNextPage = true;
	}
});


var getResults = function() { 
	
	$scope.isSearching=true;
    
	searchService.search($scope.results.searchTerms, $scope.resultsPage).then(function(es_return){
	
	var totalHits = es_return.hits.total;
	if(totalHits>0){
		setTimeout(function(){
		$scope.results.documentCount = totalHits;
		$scope.results.documents.push.apply($scope.results.documents, searchService.formatResults(es_return.hits.hits));
		},300)
	}
	else {
		$scope.noResults = true;
	}
	$scope.isSearching = false;
},
function(error){
console.log(error.message);	
$scope.isSearching = false;
});
}

}])


.service('searchService',['$q','esFactory',function($q, esFactory){
	var esClient = esFactory({
		location: 'localhost:9200'
	});
	
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
			
		});
	};
}]);