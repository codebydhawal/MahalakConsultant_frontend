import axios from "axios";
import { ApiResponse } from "./ApiResponse";

export type PricingRuleKind = "tax-rule" | "discount-rule" | "shipping-rule";
export interface PricingRule { taxId?: string; discountId?: string; shippingId?: string; name: string; rate: number; active: boolean; startDate: string; endDate?: string; }
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const base = (kind: PricingRuleKind) => `http://localhost:8080/rest/${kind}`;
const idFor = (kind: PricingRuleKind, rule: PricingRule) => kind === "tax-rule" ? rule.taxId : kind === "discount-rule" ? rule.discountId : rule.shippingId;
const paramFor = (kind: PricingRuleKind) => kind === "tax-rule" ? "taxId" : kind === "discount-rule" ? "discountId" : "shippingId";

const PricingRuleService = {
  list(kind: PricingRuleKind) { return axios.get<ApiResponse<PricingRule[]>>(`${base(kind)}/get-all`, auth()); },
  add(kind: PricingRuleKind, rule: PricingRule) { return axios.post<ApiResponse<PricingRule>>(`${base(kind)}/add`, rule, auth()); },
  update(kind: PricingRuleKind, rule: PricingRule) { return axios.patch<ApiResponse<PricingRule>>(`${base(kind)}/update`, rule, { ...auth(), params: { [paramFor(kind)]: idFor(kind, rule) } }); },
  remove(kind: PricingRuleKind, rule: PricingRule) { return axios.delete<ApiResponse<PricingRule>>(`${base(kind)}/delete`, { ...auth(), params: { [paramFor(kind)]: idFor(kind, rule) } }); },
};
export default PricingRuleService;
