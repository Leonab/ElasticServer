angular.module('searchApp',['elasticsearch','ngSanitize','searchService'])

.controller('SearchResultsList',['$scope','searchService',function($scope, searchService){
	
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
};

	
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
		
		$scope.results.documentCount = totalHits;
		$scope.results.documents.push.apply($scope.results.documents, searchService.formatResults(es_return.hits.hits));
		
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
};

}]);

