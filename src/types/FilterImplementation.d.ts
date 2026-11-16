import { Ref } from "vue";
import { QueryBuilderColumnOption, QueryBuilderOperatorValue } from "@/types/QueryBuilder";

export interface FilterDefinition {
  operator: QueryBuilderOperatorValue;
  value: any;
}

export interface FilterImplementation {
  getFilterDefinition: () => null | FilterDefinition;
  resetFilter: () => void;
  valid: Ref<boolean>;
}

export interface ColumnDropdownSlotProps {
  columnKey: string;
  updateColumn: (val: string) => void;
  columnOptions?: QueryBuilderColumnOption[];
};