    var app = angular.module('MyApp', ['ngRoute']);

    app.config(function($routeProvider) {
      /*ROTAS*/
      $routeProvider
      .when('/aposta', {
        templateUrl: 'paginas/aposta.html',
        controller: 'aposta'
      })
      .when('/consultarAposta', {
        templateUrl: 'paginas/consultaAposta.html',
        controller: 'consultarAposta'
      })
      .otherwise('/aposta', {
        templateUrl: 'paginas/aposta.html',
        controller: 'home'
      });
    }).run(function() {
    //remove 300ms delay touch
    //FastClick.attach(document.body);
  });

    function toTop() {
      $('html, body').animate({
        scrollTop: 0
      }, 800, 'linear');
    }

var vetor = new Array(); //Vetor de Campeonatos Total
var vetorHora = new Array(); //Vetor com as datas Dos jogos
var aux = new Array(); //Vetor que armazera o camponatos Teporariamente/ Camp que estjam relacionados com uma data e jogo em comum
var jsonServidor;
var jogosIdAposta = new Array(); //Vetor para armazenar os id dos jogos que apostado
var palpites = new Array(); //Vetor para armezenar os palpites selecionados
var nome_palpites = new Array(); //Vetor para armazenar os nome do palpites Exemplo Casa Fora Empate
var casa = new Array(); //Array que armazena o nome do time da casa
var fora = new Array(); //Array que armazena o nome do time visitante
var contador = 0; //Contador para gerenciar o indece do vetores ->>palpite,jogoIdAposta,nome_palpites,casa,fora
//Vetor que armazena os tipo de aposta
var tpapites = ["valor_casa", "valor_fora", "valor_empate", "valor_dupla", "valor_1_2", "max_gol_2", "min_gol_3", "ambas_gol"];
var auxiliar=0; //recebe o valor da aposta para mostrar na view
var testeA=0; //recebe o valor da aposta
var copiaJsonAposta;
var jsonApostas;
var datasJogos = new Array();// vetor que guarda as datas dos jogos das apostas;
var ultimaAposta;//variavel q guarda a ultima aposta do cambista;

// Controller para buscar aposta por codigo
app.controller('consultarAposta', function($scope, $http, $route, $location) { 
// metodo que faz a logica para mostrar o Loader na tela 
$scope.mostrarLoader = function(){
  if($scope.aux==null || $scope.aux==false || $scope.aux==true){
   $scope.aux=false;   
   $scope.aux2=true;
 }
}
// Metodo que faz o cosumo do serviço disponibilizado pelo servido, metodo retorna a aposta e seu status, basta enviar por parametro o codigo da aposta
var aptStatus;
$scope.BuscarAposta = function() {
  $http.get('http://betsoccer.club/public/aposta/consultar/'+$scope.codAposta).then(function(response) {
    $scope.aux2=false;
    $scope.aux=true;
    $scope.ApostaStatus = response.data;
    aptStatus = response.data;
  }).catch(function(err) {
    $scope.aux2=false;
    $scope.aux=false;
    if(err.status==403){
      Materialize.toast('Código não encontrado', 4000);
    }else{
      Materialize.toast('Erro na comunicação!', 4000);
    }

  });
}

$scope.toData = function(dateTime) {  
  var dateTime = dateTime.split(" "); //Cria um array com uma posição ["2016-07-10 12:40:10"]
  var date = dateTime[0].split("-"); //Separa A string aprtir do "-" Cria um Array com tres posições ["2016", "17", "10"]
  var dataFinal = date[2] + "/" +
  date[1];
  return dataFinal; //Retona a data No Padrao Brasileiro ["10/17/2016"]
}
 //Metodo que faz um split em string DataTime e retonar apenas a Hora
 $scope.toHora = function(dateTime) {
  var dateTime = dateTime.split(" "); //Cria um array com uma posição ["2016-07-10 12:40:10"]
  var time = dateTime[1].split(":"); //Separa a string aprtir do ":" Cria um Array com tres posições ["12", "40", "10"]
  var timeFinal = time[0] + ":" + time[1];
  return timeFinal; //Retona a hora descosiderando os segundos ["12:40"]
}

$scope.verificaStatusAposta = function(statusAposta){
  if(statusAposta==true){
    return "Valida";
  }else{
    return "Aguardando Validação";
  }
}

$scope.apostaVencedora = function(statusAposta){
  if(statusAposta==true){
    return "Sim";
  }else{
    return "Não";
  }

}

$scope.retornaValorPalpite = function(ob){
  for(var i in aptStatus.palpites){
    if(ob==aptStatus.palpites[i].jogos_id){
      var x = aptStatus.palpites[i].palpite;
     return x;
   }
 }
}

$scope.retornaPalpite = function (ob){

  for(var i in aptStatus.palpites){
    if(ob==aptStatus.palpites[i].jogos_id){
      var x;
      if(aptStatus.palpites[i].tpalpite=="valor_casa"){
        x="Casa";
        return x;
      }else if(aptStatus.palpites[i].tpalpite=="valor_fora"){
        x="Fora";
        return x;
      } else if(aptStatus.palpites[i].tpalpite=="valor_empate"){
        x="Empate";
        return x;
      } else if(aptStatus.palpites[i].tpalpite=="valor_dupla"){
        x="Dupla";
        return x;
      } else if(aptStatus.palpites[i].tpalpite=="valor_1_2"){
        x="Gol 1/2";
        return x;
      } else if(aptStatus.palpites[i].tpalpite=="min_gol_3"){
        x="+2.5";
        return x;
      } else if(aptStatus.palpites[i].tpalpite=="max_gol_2"){
        x="-2.5";
        return x;
      } else if(aptStatus.palpites[i].tpalpite=="ambas_gol"){
        x="Ambas";
        return x;
      }
    }
  }
}
toTop();

});

//-----------------------------------------------FIM BUSCAR CONtrOLLER POR CODIGO--------------------------------------------

//Controller para realizar o acerto com os agentes, pra consumir o servico é necessario o cod. Seguranca do cambista e do ADM.
app.controller('acertoCambista', function($scope, $http, $route, $location) { 
 $scope.mostrarLoader = function(){
  if($scope.aux==null || $scope.aux==false || $scope.aux==true){
   $scope.aux=false;   
   $scope.aux2=true;
 }
}
$scope.acertar = function() {
  $http.get('http://betsoccer.club/public/cambista/acerto/'+$scope.codCambista+'/'+$scope.codAdm).then(function(response) {
    $scope.aux2=false;
    $scope.aux=true;
    Materialize.toast('Acerto realizado Com Sucesso', 6000);
  }).catch(function(err) {
    $scope.aux2=false;
    $scope.aux=true;
    if(err.status==400){
      Materialize.toast('Código de Segurança Inexistente', 4000);
    }else if(err.status==401){
      Materialize.toast('Código de Segurança Inativo', 4000);
    }else{
      Materialize.toast('Erro na comunicação!', 4000);
    }

  });
}

});
//---------------------------------------------------FIM ACERTO-----------------------------------------------------------------

// Controller para fazer a impressão da ultima aposta realizada pelo agente
app.controller('imprimirUltima', function($scope, $http, $route, $location) { 
 $scope.mostrarLoader = function(){
  if($scope.aux==null || $scope.aux==false || $scope.aux==true){
   $scope.aux=false;   
   $scope.aux2=true;
 }
}
$scope.imprimirUltimaAposta = function() {
  $http.get('http://betsoccer.club/public/aposta/ultima/'+$scope.password).then(function(response) {
    $scope.ultimaAposta = response.data;
    ultimaAposta=response.data;
      /*for (var i in ultimaAposta.aposta.jogos) {
        console.log(i)
          console.log(ultimaAposta.cambista);
          console.log(ultimaAposta.aposta.jogos[i].data);
          console.log(ultimaAposta.aposta.jogos[i].data);
          console.log(ultimaAposta.aposta.jogos[i].times[0].descricao_time);
          console.log(ultimaAposta.aposta.jogos[i].times[1].descricao_time);
          console.log(ultimaAposta.palpites[i].tpalpite); 
          console.log(ultimaAposta.palpites[i].palpite);
      }
      */imprimirUltimaApostaCambista();
      $scope.aux2=false;
      $scope.aux=true;
    }).catch(function(err) {
      $scope.aux2=false;
      $scope.aux=true;
      if(err.status==400){
        Materialize.toast('Código de Segurança Inexistente', 4000);
      }else if(err.status==401){
        Materialize.toast('Código de Segurança Inativo', 4000);
      }else{
        Materialize.toast('Erro na comunicação!', 4000);
      }

    });
  }

});
//----------------------------------------------FIM ULTIMA APOSTA-------------------------------------------------------------------------

// Controllers para pegar os dados por aposta dos cambistas
app.controller('teste', function($scope, $http, $route, $location) { 
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
});
app.controller('dadosPorAposta', function($scope, $http, $route, $location) { 
 $scope.mostrarLoader = function(){
  if($scope.aux==null || $scope.aux==false || $scope.aux==true){
   $scope.aux=false;   
   $scope.aux2=true;
 }
}

$scope.buscarDadosPorAposta = function() {
  $http.get('http://betsoccer.club/public/aposta/premiosApostas/'+$scope.password).then(function(response) {
    $scope.dadosPorAposta = response.data;
    $scope.aux2=false;
    $scope.aux=true;
  }).catch(function(err) {
    $scope.aux2=false;
    $scope.aux=false;
    if(err.status==400){
      Materialize.toast('Código de Segurança Inexistente', 4000);
    }else if(err.status==401){
      Materialize.toast('Código de Segurança Inativo', 4000);
    }else{
      Materialize.toast('Erro na comunicação!', 4000);
    }

  });
}
$scope.toData = function(dateTime) {

                var dateTime = dateTime.split(" "); //Cria um array com uma posição ["2016-07-10 12:40:10"]
                var date = dateTime[0].split("-"); //Separa A string aprtir do "-" Cria um Array com tres posições ["2016", "17", "10"]
                var dataFinal = date[2] + "/" +
                date[1];
                return dataFinal; //Retona a data No Padrao Brasileiro ["10/17/2016"]
              }
            //Metodo que faz um split em string DataTime e retonar apenas a Hora
            $scope.toHora = function(dateTime) {
            var dateTime = dateTime.split(" "); //Cria um array com uma posição ["2016-07-10 12:40:10"]

            var time = dateTime[1].split(":"); //Separa a string aprtir do ":" Cria um Array com tres posições ["12", "40", "10"]
            var timeFinal = time[0] + ":" + time[1];

            return timeFinal; //Retona a hora descosiderando os segundos ["12:40"]

          }
          toTop();
          $(document).ready(function(){
        // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });

          $(document).ready(function(){
            $('ul.tabs').tabs();
          });


        });
//------------------------------------------FIM DADOS POR APOSTA------------------------------------------------------------------------

// controller para pegar os dados do agente 
app.controller('dadosCambista', function($scope, $http, $route, $location) { 
  $scope.mostrarLoader = function(){
    if($scope.teste==null || $scope.teste==false || $scope.teste==true){
     $scope.teste=false;   
     $scope.teste2=true;
   }
 }
 $scope.buscarDadosCambista = function() {   
  $http.get('http://betsoccer.club/public/aposta/ganhosApostas/'+$scope.password).then(function(response) {
    $scope.dados = response.data;
    $scope.teste2=false;
    $scope.teste=true;
  }).catch(function(err) {
   $scope.teste=false;
   $scope.teste2=false;
   if(err.status==400){
    Materialize.toast('Código de Segurança Inexistente', 4000);
  }else if(err.status==401){
    Materialize.toast('Código de Segurança Inativo', 4000);
  }else{
    Materialize.toast('Erro na comunicação!', 4000);
  }
});
}
toTop();
$(document).ready(function() {
        // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });
});
//----------------------------------------------------FIM DADOS AGENTE---------------------------------------------------

app.controller('controlCollapseible', function($scope, $http, $route, $location, $rootScope) {
  $(document).ready(function() {
    $('.collapsible').collapsible();
  });
  var allRadios = new Array();

    //Metodo que verifica no jogo o nome do palpite a parte do valor passado.
    //params j = jogo Obejeto  | p=palpite Double
    function nomePapite(j, p) {
        //intera dentro do vetor com os tipo de palpites
        for (var i in tpapites) {
            //compara o valor do jogo na possição dos palpites e verifica se e igual o valor do palpite passado
            if (j[tpapites[i]] == p) {
                //Retonar um tipo de palpite Exemplo valor_casa / valor_fora
                return tpapites[i];
              }
            }
          }
          $scope.jogosContem = function(){
            if(response.data.jogos[0]==null ||response.data.jogos[0]== undefined){
              return true;
            }else{ a
              return false;
            }
          }

      // Função para deschecar um radio
    // Adicionar ou remover dados das aposta dos arrays de acordo com os radios.
      $scope.check = function(event,j, p) {

        //Pega a classe do inpunt clicado
        var classe = event.currentTarget.className;
        //Pega todos inputs da mesma classe do input clicado
        var elems = document.getElementsByClassName(event.currentTarget.className);
        //salva o estado atual do input passado
        var currentState = event.currentTarget.checked;        
        var elemsLength = elems.length;

        for(i=0; i<elemsLength; i++)
        {
          if(elems[i].type === "checkbox")
          {
            elems[i].checked = false;   
          }
        }
        if (currentState == false) {
          var indice = jogosIdAposta.indexOf(j.id);
            //Pega o indice do jogo atual
            allRadios.splice(indice,1);
            datasJogos.splice(indice, 1);
            jogosIdAposta.splice(indice, 1); //Remove id do jogo na possição indice
            palpites.splice(indice, 1); //Remove palpite do jogo na possição indice
            nome_palpites.splice(indice, 1); //Remove Tpalpite do jogo na possição indice
            casa.splice(indice, 1); //Remove o time da casa na possição indice
            fora.splice(indice, 1); //Remove o time visitante do jogo na possição indice 
            contador--; //Decremento o contator usando em todos o arrays
          } else if(allRadios.indexOf(classe) == -1) {
            console.log("2---"+allRadios.indexOf(classe));            
            datasJogos[contador]= j.data;
            jogosIdAposta[contador] = j.id;
            palpites[contador] = p;
            casa[contador] = j.time[0].descricao_time;
            fora[contador] = j.time[1].descricao_time;
            nome_palpites[contador] = nomePapite(j, p);
            allRadios[contador] = classe;
            contador++;
          }else if(allRadios.indexOf(classe) != -1){            
            var indice = jogosIdAposta.indexOf(j.id);
            datasJogos[indice]= j.data;
            jogosIdAposta[indice] = j.id;
            palpites[indice] = p;
            casa[indice] = j.time[0].descricao_time;
            fora[indice] = j.time[1].descricao_time;
            nome_palpites[indice] = nomePapite(j, p);
          }
          event.currentTarget.checked = currentState;
        }
    //Verifica palpites com valor padrao escolhoido para desabilitar
    $scope.verificaPalpite = function(valor){
      if(valor<=1){
        return true;
      }else{ 
        return false;
      }
    }
    // verifica se o valor é o padrao escolhido pelo servidor  e coloca traço
    $scope.PalpiteColocarTraco = function(valor){
      if(valor<=1){
        var traco="-----";
        return traco;
      }else{ 
        return valor;
      }
    }
    /*Metodo que controla o Json que será enviado ao servidor
      parametros -> j = id_jogos | p = palpite double | t = tipo de palpite string 
      parametros -> c = descrição_time visitante  String | f = descricao_time visitante String
      */
      $scope.montarJsonServidor = function(j, p, t) {
        var dadosAposta = JSON.stringify({
          valor_aposta: $scope.valor,
          nome_apostador: $scope.nome,
          jogo: j,
          valorPalpite: p,
          tpalpite: t
        });

       //console.log("dados "+dadosAposta);
       return dadosAposta;
     }

    //Metodo que envia um json para o servidor com os dados das aposta.
    $scope.enviar = function() {
      var json = $scope.montarJsonServidor(jogosIdAposta, palpites, nome_palpites);
      $http({
        url: 'http://betsocceroficial.herokuapp.com/aposta/apostarSemCodigo',
        method: 'POST',
        data: json,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).
      success(function(resposta) {
        Materialize.toast('Aposta realizada Com Sucesso', 4000);
        jsonApostas = resposta;
           // imprimirAposta();
        alert("CODIGO APOSTA : "+jsonApostas.aposta.codigo+" ANOTE O CODIO PARA FUTURAS CONSULTAS");
        $location.path("/aposta");
         }).
      error(function(data) {
        if(data.status==400){
          Materialize.toast('quantidade de jogos inferior a 2', 4000);
        }else if(data.status==402){
          Materialize.toast('quantidade de jogos inferior a 2', 4000);
        }else if(data.status==402){
          Materialize.toast('quantidade de jogos inferior a 2', 4000);
        }else if(data.status==402){
          Materialize.toast('quantidade de jogos inferior a 2', 4000);
        }else{ 
          Materialize.toast('Erro na comunicação, tente novamente!', 4000);
        $scope.error = true;
      }
       

      });

    }
    var contAux;
    $scope.re = function retornoPossivel(){
      auxiliar=testeA;
      for (var k in palpites) {
        auxiliar = auxiliar * palpites[k];           
      }
      return auxiliar.toFixed(2);
    }


  });



    app.controller('aposta', function($scope, $http, $routeParams, $location, $rootScope) {

    //recebe o valor da aposta
    $scope.enviarValor = function(){
      usarNaApostas =
      testeA = $scope.valor;
    }


    $scope.buscar = function() {
      $http.get('http://betsoccer.club/public/aposta').then(function(response) {
        // var json = JSON.stringify(response.data)
        // var json = JSON.parse(jso); 
        // window.localStorage.setItem("ArquivoServidor",response.data); 

        for (var k in response.data.jogos) {
          if (k == 0) {
            vetor.push(response.data.jogos[k].campeonato.descricao_campeonato);
          } else {
            if (!dadosCamp(vetor, response.data.jogos[k].campeonato.descricao_campeonato)) {
              vetor.push(response.data.jogos[k].campeonato.descricao_campeonato);
            }
          }
          if (k == 0) {
            vetorHora.push(response.data.jogos[k].data);
          } else {
            if (!dadosHora(vetorHora, toData(response.data.jogos[k].data))) {
              vetorHora.push(response.data.jogos[k].data);
            }
          }      
        }

        //Metodo que faz um split em string DataTime e retonar apenas a Data
        $scope.toData = function(dateTime) {

                var dateTime = dateTime.split(" "); //Cria um array com uma posição ["2016-07-10 12:40:10"]
                var date = dateTime[0].split("-"); //Separa A string aprtir do "-" Cria um Array com tres posições ["2016", "17", "10"]
                var dataFinal = date[2] + "/" +
                date[1] + "/" + date[0];
                return dataFinal; //Retona a data No Padrao Brasileiro ["10/17/2016"]
              }
            //Metodo que faz um split em string DataTime e retonar apenas a Hora
            $scope.toHora = function(dateTime) {
            var dateTime = dateTime.split(" "); //Cria um array com uma posição ["2016-07-10 12:40:10"]

            var time = dateTime[1].split(":"); //Separa a string aprtir do ":" Cria um Array com tres posições ["12", "40", "10"]
            var timeFinal = time[0] + ":" + time[1];

            return timeFinal; //Retona a hora descosiderando os segundos ["12:40"]

          }

        //Metodo para verifica se a data passada ja exite no vertorHora
        function dadosHora(vetorHora, dataTime) {
          for (var i in vetorHora) {
            if (toData(vetorHora[i]) == dataTime) {
              return true;
            }
          }
          return false;
        }
        /*
          Metodo que que recebe uma hora->DataTime e retornar um vetor com os campeonatos
          que tenha relação com algum jogo e a hora passada
          */
          $scope.CampEmJogos = function(hora) {
            aux = new Array();
            //Inteira pelos jogos quem vem do Web service
            for (var k in response.data.jogos) {
                //verifica se alum jogo.data e igual a data passada por paramentro
                if ($scope.toData(hora) == $scope.toData(response.data.jogos[k].data)) {
                    //vefica se esse se o campeonato não ja foi inserido no vertor
                    if (!dadosCamp(aux, response.data.jogos[k].campeonato.descricao_campeonato)) {
                        //Por fim insere no array o campeonato
                        aux.push(response.data.jogos[k].campeonato.descricao_campeonato);
                      }

                    }
                  }

                  return aux;
                };

                $scope.campeonatos = vetor;
                $scope.horas = vetorHora;
                $scope.aposta = response.data;
                jsonServidor = response.data;
        //window.localStorage.setItem("jsonServidor",response.data);
        //window.localStorage.setItem("todosCampeonatos",aux);
        //window.localStorage.setItem("todasDatas",vetorHora);

      }, function(err) {
        Materialize.toast('Erro na comunicação!', 4000);
        //console.log(err);
      });
    }

    $scope.buscar();// busca todos os dados dos jogos no servidor
    $scope.timeCasa=casa;
    $scope.timeFora=fora;
    $scope.palpiteNumero=palpites;

    $scope.nomePapites= function(np){
      var vetorPalpitesCorretos;

      if(nome_palpites[np]=="valor_casa"){
        vetorPalpitesCorretos="Casa";
      }
      if(nome_palpites[np]=="valor_fora"){
        vetorPalpitesCorretos="Fora";
      } 
      if(nome_palpites[np]=="valor_empate"){
        vetorPalpitesCorretos="Empate";
      } 
      if(nome_palpites[np]=="valor_dupla"){
        vetorPalpitesCorretos="Dupla";
      } 
      if(nome_palpites[np]=="valor_1_2"){
        vetorPalpitesCorretos="Gol 1/2";
      } 
      if(nome_palpites[np]=="max_gol_2"){
        vetorPalpitesCorretos="-2.5";
      } 
      if(nome_palpites[np]=="min_gol_3"){
        vetorPalpitesCorretos="+2.5";
      } 
      if(nome_palpites[np]=="ambas_gol"){
        vetorPalpitesCorretos="Ambas";
      }

      return vetorPalpitesCorretos;       
    }

    $scope.tamanhoVetor = function(){
      var array = new Array();
      for(var i in  nome_palpites){
        array.push(i);
      }
      return array;
    }
    $scope.jsonApostasDinamicas = function(){
      var arrayJson= new Array();
      for(var i in  nome_palpites){
       var dadosAposta = JSON.stringify({
        casa: $scope.timeCasa[i],
        fora: $scope.timeFora[i],
        valorPalpite: $scope.palpiteNumero[i],
      });
       arrayJson.push(dadosAposta);
       console.log(arrayJson);
       console.log("dados Dina"+dadosAposta);
     }

     return arrayJson;
   }
    toTop();// Rola a pagina pra cima

    // Ativa a função do modal na rota, função do materialize
    $(document).ready(function() {
        // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });
  });

    function dadosCamp(vetor, valor) {
      for (var i in vetor) {
        if (vetor[i] == valor) {
          return true;
        }
      }
      return false;
    }

    function CampEmJogosPorData(hora) {
      aux = new Array();
    //percorre
    for (var k in jsonServidor.jogos) {
        //console.log("--------------------");
        if (toData(hora) == toData(jsonServidor.jogos[k].data)) {
            //console.log("Json data -> "+response.data.jogos[k].data);
            if (!dadosCamp(aux, jsonServidor.jogos[k].campeonato.descricao_campeonato)) {
              aux.push(jsonServidor.jogos[k].campeonato.descricao_campeonato);
            }
            //console.log("Camp Aux -> "+aux);
          }
        }
        return aux;
      };

      app.elememt(document).ready(function() {
        alert("entrei");
        window.broadcaster.addEventListener("DatecsPrinter.connectionStatus", function(e) {
          if (e.isConnected) {
            alert('connect impress');
          }
        });
      });