import { OperatorType } from '@open-dcp/filter';
import type { QueryBuilderOperatorOption, QueryBuilderOperatorValue } from '@/types/QueryBuilder';

export type OperatorOption = QueryBuilderOperatorOption;

const OPERATOR_LABELS: Partial<Record<OperatorType, string>> = {
    '=': 'equals',
    '!=': 'notEquals',
    '>': 'greaterThan',
    '<': 'lessThan',
    '>=': 'greaterThanOrEqual',
    '<=': 'lessThanOrEqual',
    contains: 'contains',
    doesNotContain: 'doesNotContain',
    startsWith: 'startsWith',
    doesNotStartWith: 'doesNotStartWith',
    endsWith: 'endsWith',
    doesNotEndWith: 'doesNotEndWith',
    matches: 'matches',
    isTrue: 'isTrue',
    isFalse: 'isFalse',
    in: 'in',
    notIn: 'notIn',
    isNull: 'isNull',
    isNotNull: 'isNotNull',
    empty: 'empty',
    notEmpty: 'notEmpty',
    between: 'between',
    notBetween: 'notBetween'
};

const PREDEFINED_OPERATOR_SETS: Record<string, OperatorType[]> = {
    numeric: [
        '=', '!=', '>', '<', '>=', '<=', 'between', 'notBetween', 'isNull', 'isNotNull', 'empty', 'notEmpty', 'in', 'notIn'
    ],
    string: [
        '=', '!=', 'contains', 'doesNotContain', 'startsWith', 'doesNotStartWith', 'endsWith', 'doesNotEndWith',
        'matches', 'isNull', 'isNotNull', 'empty', 'notEmpty', 'in', 'notIn'
    ],
    date: [
        '=', '!=', '>', '<', '>=', '<=', 'between', 'notBetween', 'isNull', 'isNotNull', 'empty', 'notEmpty', 'in', 'notIn'
    ],
    boolean: [
        'isTrue', 'isFalse', 'isNull', 'isNotNull'
    ]
};

type OperatorSetKey = keyof typeof PREDEFINED_OPERATOR_SETS;

type OperatorOverrides = {
    include?: QueryBuilderOperatorValue[];
    exclude?: QueryBuilderOperatorValue[];
};

/**
 * Returns a list of operator options based on a predefined set key ('numeric', 'string', 'date')
 * or a custom list of OperatorType. Optionally applies include/exclude overrides.
 * @param typeOrList - Operator set key or custom list of OperatorType.
 * @param t - Optional translation function for labels.
 * @param translationPrefix - Prefix for translation keys.
 * @param overrides - Optional object to include or exclude specific operators.
 * @returns Array of OperatorOption objects.
 */
export function useFilterOperatorList(
    typeOrList: OperatorSetKey | QueryBuilderOperatorValue[],
    t?: (key: string) => string,
    translationPrefix: string = '',
    overrides?: OperatorOverrides
): OperatorOption[] {
    let baseTranslationPath = '';
    if (translationPrefix) {
        baseTranslationPath = translationPrefix.endsWith('.') ? translationPrefix : translationPrefix + '.';
    }
    const translationPath = baseTranslationPath + 'filter.operator.';

    let operators: QueryBuilderOperatorValue[] = Array.isArray(typeOrList)
        ? typeOrList
        : PREDEFINED_OPERATOR_SETS[typeOrList] ?? [];

    if (!Array.isArray(typeOrList) && overrides) {
        if (overrides.exclude) {
            operators = operators.filter(op => !overrides.exclude!.includes(op));
        }
        if (overrides.include) {
            operators = [...operators, ...overrides.include.filter(op => !operators.includes(op))];
        }
    }

    const getOperatorLabel = (operator: QueryBuilderOperatorValue) => {
        return OPERATOR_LABELS[operator as OperatorType] ?? operator;
    };

    return operators.map(op => ({
        label: t ? t(translationPath + getOperatorLabel(op)) : (translationPath + getOperatorLabel(op)),
        value: op
    }));
}