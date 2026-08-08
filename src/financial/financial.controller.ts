import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PapelUsuario, PermissaoProjeto } from '@prisma/client';
import { RequireProjectAccess } from '../auth/decorators/require-project-access.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  SaveDocumentDto,
  SaveEvaluationDto,
  SaveInsuranceDto,
  SaveTransactionDto,
} from './dto/financial.dto';
import { FinancialService } from './financial.service';

@Controller('projetos/:projetoId/obras/:obraId/financeiro')
@Roles(PapelUsuario.ADMIN_EMPRESA, PapelUsuario.USUARIO)
export class FinancialController {
  constructor(private readonly service: FinancialService) {}
  @Get() @RequireProjectAccess(PermissaoProjeto.VISUALIZAR) get(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
  ) {
    return this.service.get(p, w);
  }
  @Post('aquisicao')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createAcquisition(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveTransactionDto,
  ) {
    return this.service.saveTransaction(p, w, 'aquisicao', dto, true);
  }
  @Patch('aquisicao')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateAcquisition(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveTransactionDto,
  ) {
    return this.service.saveTransaction(p, w, 'aquisicao', dto, false);
  }
  @Delete('aquisicao')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeAcquisition(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
  ) {
    return this.service.removeTransaction(p, w, 'aquisicao');
  }
  @Post('venda') @RequireProjectAccess(PermissaoProjeto.EDITAR) createSale(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveTransactionDto,
  ) {
    return this.service.saveTransaction(p, w, 'venda', dto, true);
  }
  @Patch('venda') @RequireProjectAccess(PermissaoProjeto.EDITAR) updateSale(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveTransactionDto,
  ) {
    return this.service.saveTransaction(p, w, 'venda', dto, false);
  }
  @Delete('venda') @RequireProjectAccess(PermissaoProjeto.EDITAR) removeSale(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
  ) {
    return this.service.removeTransaction(p, w, 'venda');
  }

  @Post('aquisicao/notas-fiscais')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createInvoice(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveDocumentDto,
  ) {
    return this.service.saveDocument(p, w, 'nota', dto);
  }
  @Patch('aquisicao/notas-fiscais/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateInvoice(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveDocumentDto,
  ) {
    return this.service.saveDocument(p, w, 'nota', dto, id);
  }
  @Delete('aquisicao/notas-fiscais/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeInvoice(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeDocument(p, w, 'nota', id);
  }
  @Post('aquisicao/comprovantes')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createPayment(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveDocumentDto,
  ) {
    return this.service.saveDocument(p, w, 'pagamento', dto);
  }
  @Patch('aquisicao/comprovantes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updatePayment(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveDocumentDto,
  ) {
    return this.service.saveDocument(p, w, 'pagamento', dto, id);
  }
  @Delete('aquisicao/comprovantes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removePayment(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeDocument(p, w, 'pagamento', id);
  }
  @Post('venda/comprovantes')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createSaleReceipt(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveDocumentDto,
  ) {
    return this.service.saveDocument(p, w, 'venda', dto);
  }
  @Patch('venda/comprovantes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateSaleReceipt(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveDocumentDto,
  ) {
    return this.service.saveDocument(p, w, 'venda', dto, id);
  }
  @Delete('venda/comprovantes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeSaleReceipt(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeDocument(p, w, 'venda', id);
  }

  @Post('avaliacoes')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createEvaluation(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveEvaluationDto,
  ) {
    return this.service.saveEvaluation(p, w, dto);
  }
  @Patch('avaliacoes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateEvaluation(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveEvaluationDto,
  ) {
    return this.service.saveEvaluation(p, w, dto, id);
  }
  @Delete('avaliacoes/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeEvaluation(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeChild(p, w, 'avaliacao', id);
  }
  @Post('seguros')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  createInsurance(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Body() dto: SaveInsuranceDto,
  ) {
    return this.service.saveInsurance(p, w, dto);
  }
  @Patch('seguros/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  updateInsurance(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SaveInsuranceDto,
  ) {
    return this.service.saveInsurance(p, w, dto, id);
  }
  @Delete('seguros/:id')
  @RequireProjectAccess(PermissaoProjeto.EDITAR)
  removeInsurance(
    @Param('projetoId', new ParseUUIDPipe()) p: string,
    @Param('obraId', new ParseUUIDPipe()) w: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.removeChild(p, w, 'seguro', id);
  }
}
