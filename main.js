(function(doc){
	'use strict';

function DOM(elements){
	this.element = doc.querySelectorAll(elements);
};

DOM.prototype.on = function on(eventType, callback){
	Array.prototype.forEach.call(this.element, function(element){
		element.addEventListener(eventType, callback, false);
	});
};

DOM.prototype.off = function off(eventType, callback){
	Array.prototype.forEach.call(this.element, function(element){
		element.removeEventListener(eventType, callback, false);
	});
};

DOM.prototype.get = function get(){
	return this.element;
};

DOM.prototype.forEach = function forEach(){
	return Array.prototype.forEach.apply(this.element, arguments);
};

DOM.prototype.map = function map(){
	return Array.prototype.map.apply(this.element, arguments);
};

DOM.prototype.filter = function filter(){
	return Array.prototype.filter.apply(this.element, arguments);
};

DOM.prototype.reduce = function reduce(){
	return Array.prototype.reduce.apply(this.element, arguments);
};

DOM.prototype.reduceRight = function reduceRight(){
	return Array.prototype.reduceRight.apply(this.element, arguments);
};

DOM.prototype.every = function every(){
	return Array.prototype.every.apply(this.element, arguments);
};

DOM.prototype.some = function some(){
	return Array.prototype.some.apply(this.element, arguments);
};

DOM.prototype.isArray = function isArray( param ) {
	return Object.prototype.toString.call( param ) === '[Object Array';
};

DOM.prototype.isObject = function isObject( param ) {
	return Object.prototype.toString.call( param ) === '[Object Object';
};

DOM.prototype.isFunction = function isFunction( param ) {
	return Object.prototype.toString.call( param ) === '[Object Function';
};

DOM.prototype.isNumber = function isNumber( param ) {
	return Object.prototype.toString.call( param ) === '[Object Number';
};

DOM.prototype.isString = function isString( param ) {
	return Object.prototype.toString.call( param ) === '[Object String';
};

DOM.prototype.isBoolean = function isBoolean( param ) {
	return Object.prototype.toString.call( param ) === '[Object Boolean';
};

DOM.prototype.isNull = function isNull( param ) {
	return Object.prototype.toString.call( param ) === '[Object Null' 
	|| Object.prototype.toString.call( param ) === '[Object Undefined';
};



var $inputCEP = new DOM('[data-js="input-cep"]');
var $logradouro = new DOM('[data-js="logradouro"]');
var $bairro = new DOM('[data-js="bairro"]');
var $estado = new DOM('[data-js="estado"]');
var $cidade = new DOM('[data-js="cidade"]');
var $cep = new DOM('[data-js="cep"]');
var $status = new DOM('[data-js="status"]');
var $formCEP = new DOM('[data-js="form-cep"]');
var ajax = new XMLHttpRequest();

$formCEP.on('submit', handleSubmitFormCEP);

function handleSubmitFormCEP(event){
	event.preventDefault();
	var url = getUrl();
	ajax.open('GET', url);
	ajax.send();
	getMessage('loading');
	ajax.addEventListener('readystatechange', handleReadyStateChange);
}

function getUrl(){
return replaceCEP('https://viacep.com.br/ws/[CEP]/json/');
}

function clearCEP(){
	return $inputCEP.get()[0].value.replace(/\D/g, '');
}

function handleReadyStateChange(){
	if(isRequestOk()){
		getMessage('ok');
		fillCEPFields();
	}
}

function isRequestOk(){
	return ajax.readyState === 4 && ajax.status === 200;
}

function fillCEPFields(){
	var data = parseData();
	if(!data){
		 getMessage('error');
		 data = clearData();
	}

	$logradouro.get()[0].textContent = data.logradouro;
	$bairro.get()[0].textContent = data.bairro;
	$estado.get()[0].textContent = data.uf;
	$cidade.get()[0].textContent = data.localidade;
	$cep.get()[0].textContent = data.cep;
}

function clearData(){
	return {
		logradouro:'-',
		bairro:'-',
		uf:'-',
		localidade:'-',
		cep:'-'
	}
}

function parseData(){
	var result;
	try{
		result = JSON.parse(ajax.responseText);
	}
	catch(e) {
		result = null;
	}
	return result;
}

function getMessage(type){
	var messages = {
		loading: replaceCEP('Buscando informacoes para o CEP [CEP]...'),
		ok: replaceCEP('Endereco referente ao CEP [CEP]:'),
		error: replaceCEP('Não encontramos o endereco para o CEP [CEP].'),
	};
	$status.get()[0].textContent = messages[type];
}
	
function replaceCEP(message){
	return message.replace('[CEP]', clearCEP());
}

})(document);