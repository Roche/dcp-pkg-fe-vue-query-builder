import DcpQueryBuilder from '@/components/QueryBuilder.vue';

const dcpComponents = {
  DcpQueryBuilder
};

export default {
  install(app: any) {
    for (const [name, component] of Object.entries(dcpComponents)) {
      app.component(name, component);
    }
  },
};

// Export components individually as well
export {
  DcpQueryBuilder
};

export type {
  QueryBuilderColumnOption as DcpQueryBuilderColumnOption,
  QueryBuilderFilterCondition as DcpQueryBuilderFilterCondition,
  QueryBuilderFilterGroup as DcpQueryBuilderFilterGroup,
  QueryBuilderFilterNode as DcpQueryBuilderFilterNode,
  QueryBuilderOperatorOption as DcpQueryBuilderOperatorOption,
  QueryBuilderOperatorValue as DcpQueryBuilderOperatorValue,
  QueryBuilderValueOption as DcpQueryBuilderValueOption
} from '@/types/QueryBuilder';
