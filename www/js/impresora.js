function imprimirTodosJogos()
{
  window.DatecsPrinter.listBluetoothDevices(
    function (devices) {
      window.DatecsPrinter.connect(devices[0].address,printSomeTestText);
    },
    function (error) {
      alert("Erro na conmunicação com a impressora!");
      swal(JSON.stringify(error));
    }
    );
}

function imprimirAposta()
{
  window.DatecsPrinter.listBluetoothDevices(
    function (devices) {
      window.DatecsPrinter.connect(devices[0].address,printSomeTestText2);
    },
    function (error) {
      alert("Erro na conmunicação com a impressora!");
      location.reload();
      swal(JSON.stringify(error));
    }
    );
}

function imprimirUltimaApostaCambista()
{
  window.DatecsPrinter.listBluetoothDevices(
    function (devices) {
      window.DatecsPrinter.connect(devices[0].address,printSomeTestText3);
    },
    function (error) {
      alert("Erro na conmunicação com a impressora!");
      location.reload();
      swal(JSON.stringify(error));
    }
    );
}

function nomePapites(np){
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
  if(nome_palpites[np]=="min_gol_3"){
    vetorPalpitesCorretos="+2.5";
  } 
  if(nome_palpites[np]=="max_gol_2"){
    vetorPalpitesCorretos="-2.5";
  } 
  if(nome_palpites[np]=="ambas_gol"){
    vetorPalpitesCorretos="Ambas";
  }

  return vetorPalpitesCorretos;       
}

function toData(dateTime) {
var dateTime = dateTime.split(" ");//dateTime[0] = date, dateTime[1] = time
var date = dateTime[0].split("-");
var dataFinal = date[2]+"/"+date[1];
return dataFinal;   
}

function toHora(Time) {
var Time = Time.split(" ");//dateTime[0] = date, dateTime[1] = time
var time = Time[1].split(":");
var timeFinal = time[0]+":"+time[1];
return timeFinal;    
}

function printSomeTestText() {
 window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
 window.DatecsPrinter.printText("{b}{w}{h}BETSOCCER{/h}{/w}{/b}{CENTER}{br}",'ISO-8859-1', function(){} );
 var vetor;
 for(var datas in vetorHora){
  window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("{b}"+toData(vetorHora[datas])+"{CENTER}{/b}{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("HORA  JOGO{br}",'ISO-8859-1', function(){});
  vetor=CampEmJogosPorData(vetorHora[datas]);
  for(var camp in vetor){
   window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} ); 
   window.DatecsPrinter.printText(vetor[camp]+"{CENTER}{br}",'ISO-8859-1',  function(){ });
   window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
   for(var jg in jsonServidor.jogos){
    if(jsonServidor.jogos[jg].campeonato.descricao_campeonato==vetor[camp] && toData(jsonServidor.jogos[jg].data)==toData(vetorHora[datas])){
      window.DatecsPrinter.printText("{b}"+toHora(jsonServidor.jogos[jg].data)+"{/b}  {b}"+jsonServidor.jogos[jg].time[0].descricao_time+" VS {/b}{b}"+ jsonServidor.jogos[jg].time[1].descricao_time+"{/b}{br}",'ISO-8859-1',  function(){ });
      window.DatecsPrinter.printText("{s}Casa  Empate  Fora  Dupla  Gol1/2  +2.5  -2.5  Ambas {/s}{br}",'ISO-8859-1', function(){});
      window.DatecsPrinter.printText("{s}"+jsonServidor.jogos[jg].valor_casa+"   "+jsonServidor.jogos[jg].valor_empate+"   "+jsonServidor.jogos[jg].valor_fora+"   "+jsonServidor.jogos[jg].valor_dupla+"   "+jsonServidor.jogos[jg].valor_1_2+"   "+jsonServidor.jogos[jg].max_gol_2+"   "+jsonServidor.jogos[jg].min_gol_3+"   "+jsonServidor.jogos[jg].ambas_gol+"{/s}{br}",'ISO-8859-1', function(){});

    }

  }

}
}
window.DatecsPrinter.printText("{br}{br}{br}{br}{br}{br}",'ISO-8859-1', function(){} );
}


function printSomeTestText2() {
  window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("{b}{w}{h}BETSOCCER{/h}{/w}{/b}{CENTER}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("{b}{w}COMPROVANTE{/w}{/b}{CENTER}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("------------------------------------------------{br}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("AGENTE: "+jsonApostas.cambista+"{br}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("CÓDIGO APOSTA: {w}{b}"+jsonApostas.aposta.codigo+"{/b}{/w}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("DATA: "+toData(jsonApostas.aposta.created_at)+" AS "+toHora(jsonApostas.aposta.created_at)+" HRS{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("NOME APOSTADOR: {b}"+jsonApostas.aposta.nome_apostador+"{/b}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("VALOR APOSTADO: {b}R$ "+jsonApostas.aposta.valor_aposta+"{/b}{br}RETORNO POSSIVEL: {w}{b}R$"+auxiliar.toFixed(2)+"{/b}{/w}{br}",'ISO-8859-1',  function(){ });

  for (var i in jogosIdAposta) {
    window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
    window.DatecsPrinter.printText(toData(datasJogos[i])+" "+toHora(datasJogos[i])+" {b} "+casa[i]+" VS "+ fora[i]+"{/b}{br}",'ISO-8859-1',  function(){ });
    window.DatecsPrinter.printText("PALPITE: "+nomePapites(i)+"  VALOR PALPITE: "+palpites[i]+"{br}",'ISO-8859-1',  function(){ });
  }
  window.DatecsPrinter.printText("________________________________________________{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("{w}AVISOS{/w}{CENTER}{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("* Não pagaremos jogos já realizados que por     falha quaisquer que sejam continuem no sistema;{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("* Ticket válido por 8 dias;{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("* Ticket será pago em até 72 horas;{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("* Se o jogo não acontecer no prazo de 24 horas  da data e hora marcada ele será retirado e as   apostas serão recalculadas.{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("{br}{br}{br}{br}{br}{br}",'ISO-8859-1', function(){});
  location.reload();

}

function printSomeTestText3() {
  window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("{b}{w}{h}BETSOCCER{/h}{/w}{/b}{CENTER}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("{b}{w}COMPROVANTE{/w}{/b}{CENTER}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("------------------------------------------------{br}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("AGENTE: "+ultimaAposta.cambista+"{br}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("CODIGO APOSTA: {w}{b}"+ultimaAposta.aposta.codigo+"{/b}{/w}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("DATA: "+toData(ultimaAposta.aposta.data.date)+" AS "+toHora(ultimaAposta.aposta.data.date)+" HRS{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("NOME APOSTADOR: {b}"+ultimaAposta.aposta.apostador+"{/b}{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("VALOR APOSTADO: {b}R$ "+ultimaAposta.aposta.valor_apostado+"{/b}{br}RETORNO POSSIVEL: {w}{b}R$"+ultimaAposta.possivel_premio+"{/b}{/w}{br}",'ISO-8859-1',  function(){ });

  for (var i in ultimaAposta.aposta.jogos) {
    window.DatecsPrinter.printText("------------------------------------------------{br}",'ISO-8859-1', function(){} );
    window.DatecsPrinter.printText(toData(ultimaAposta.aposta.jogos[i].data)+" "+toHora(ultimaAposta.aposta.jogos[i].data)+" {b} "+ultimaAposta.aposta.jogos[i].times[0].descricao_time+" VS "+ ultimaAposta.aposta.jogos[i].times[1].descricao_time+"{/b}{br}",'ISO-8859-1',  function(){ });
    window.DatecsPrinter.printText("PALPITE: "+legendaPalpites(ultimaAposta.palpites[i].tpalpite)+"  VALOR PALPITE: "+ultimaAposta.palpites[i].palpite+"{br}",'ISO-8859-1',  function(){ });
  }
  window.DatecsPrinter.printText("________________________________________________{br}",'ISO-8859-1', function(){} );
  window.DatecsPrinter.printText("{w}AVISOS{/w}{CENTER}{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("* Não pagaremos jogos já realizados que por     falha quaisquer que sejam continuem no sistema;{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("* Ticket válido por 8 dias;{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("* Ticket será pago em até 72 horas;{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("* Se o jogo não acontecer no prazo de 24 horas  da data e hora marcada ele será retirado e as   apostas serão recalculadas.{br}",'ISO-8859-1', function(){});
  window.DatecsPrinter.printText("{br}{br}{br}{br}{br}{br}",'ISO-8859-1', function(){});
  Materialize.toast('Segubda via impressa', 4000);
  location.reload();
  

}

function legendaPalpites(np){
  var PalpitesCorretos;

  if(np=="valor_casa"){
    PalpitesCorretos="Casa";
  }
  if(np=="valor_fora"){
    PalpitesCorretos="Fora";
  } 
  if(np=="valor_empate"){
    PalpitesCorretos="Empate";
  } 
  if(np=="valor_dupla"){
    PalpitesCorretos="Dupla";
  } 
  if(np=="valor_1_2"){
    PalpitesCorretos="Gol 1/2";
  } 
  if(np=="min_gol_3"){
    PalpitesCorretos="+2.5";
  } 
  if(np=="max_gol_2"){
    PalpitesCorretos="-2.5";
  } 
  if(np=="ambas_gol"){
    PalpitesCorretos="Ambas";
  }
  return PalpitesCorretos;       
}

function imprimirImagenDePrueba() 
{
  var imagen = document.getElementById("codigoDeBarrasFactura");
  var imageData = imagen.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
  window.DatecsPrinter.printImage(
    imageData, 
    canvas.width, 
    canvas.height, 
    1, 
    function() 
    {
      console.log('Impreso');
    },
    function (error) {
      swal(JSON.stringify(error)); 
    });
}
function printMyImage() {
  console.log("teste2");
  var image = new Image();
  image.src = 'img/logo.png';
  image.onload = function() {
    var canvas = document.createElement('canvas');
    canvas.height = 100;
    canvas.width = 100;
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
      var imageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, ""); //remove mimetype
      window.DatecsPrinter.printImage(
          imageData, //base64
          canvas.width, 
          canvas.height, 
          1, 
          function() {
            printMyBarcode();
          },
          function(error) {
            alert(JSON.stringify(error));
          }
          )
    };
  }

  function printMyBarcode() {
    window.DatecsPrinter.printBarcode(
    75, //here goes the barcode type code
    '13132498746313210584982011487', //your barcode data
    function() {
      alert('success!');
    },
    function() {
      alert(JSON.stringify(error));
    }
    );
  }


  
