export class CardData {
    id:number;
    faccao: string;
    funcionario: string;
    dataConclusao: Date;
    qtdOperacao: number;
    sequenciaQuebra: number;
    quebraManual: string;
    setorId:number;
    quebra:boolean;
    pacoteId: number;
    pacoteStatus:number;
    funcionarioCupom: string;
    pacoteReferencia: string;
    tempoPacote: number;
    tempoUnitario:number;
    tempoTotal:number;
    dataEmissao:Date;
    produtoDescricao:string;
    produtoReferencia:string;
    operacaoPadraoReferencia:string;
    ordemProducaoReferencia:string;
    corDescricao:string;
    tamanhoDescricao:string;
    quantidade:number;
    status:string;
    tituloCupom:string;
    sequencia:string;
    concluido:boolean =false;
    nomeDoBotao:string = "Concluído";
    operacaoPadraoId:number;
    idFuncionario:number;
    grupoPacoteId:number;
    foiFeita:boolean;
    flag:boolean=true;
    strTituloCupom:string='';

  }