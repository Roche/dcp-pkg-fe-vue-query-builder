import type {
  FilterCondition as BaseFilterCondition,
  FilterGroup as BaseFilterGroup,
  OperatorType as BaseOperatorType
} from '@open-dcp/filter';

export type QueryBuilderOperatorValue = BaseOperatorType | string;

export interface QueryBuilderOperatorOption {
  label: string;
  value: QueryBuilderOperatorValue;
}

export interface QueryBuilderValueOption {
  label: string;
  value: string | number | boolean;
}

export interface QueryBuilderColumnOption {
  label: string;
  value: string;
  type?: string;
  operators?: QueryBuilderOperatorOption[];
  valueEditor?: 'text' | 'select';
  valueOptions?: QueryBuilderValueOption[];
}

export type QueryBuilderFilterCondition = Omit<BaseFilterCondition, 'operator'> & {
  operator: QueryBuilderOperatorValue;
};

export interface QueryBuilderFilterGroup extends Omit<BaseFilterGroup, 'filters'> {
  filters: QueryBuilderFilterNode[];
}

export type QueryBuilderFilterNode = QueryBuilderFilterCondition | QueryBuilderFilterGroup;