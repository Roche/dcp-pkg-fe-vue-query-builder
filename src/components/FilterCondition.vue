<template>
    <div class="filter-condition flex items-center gap-2 mb-2 p-2">
        <div style="width: 35%;">
            <slot name="columnDropdown" :columnKey="localNode.columnKey" :updateColumn="updateColumn"
                :columnOptions="columnOptions">
                <template v-if="columnOptions && columnOptions.length">
                    <v-select density="compact" v-model="localNode.columnKey" :items="columnOptions"
                        :label="t(`${translationPrefix}filter.label.column`)" @update:modelValue="emitUpdate"
                        hide-details item-title="label" item-value="value" />
                </template>
                <template v-else>
                    <v-text-field density="compact" v-model="localNode.columnKey"
                        :label="t(`${translationPrefix}filter.label.column`)" @input="emitUpdate" hide-details />
                </template>
            </slot>
        </div>

        <div style="width: 20%;">
            <v-select density="compact" v-model="localNode.operator" :items="operatorOptions"
                :label="t(`${translationPrefix}filter.filter`)" @update:modelValue="emitUpdate" hide-details
                item-title="label" item-value="value" />
        </div>

        <div style="width: 35%;">
            <v-select v-if="selectedColumn?.valueEditor === 'select' && selectedColumn.valueOptions?.length && operatorRequiresValue"
                density="compact" v-model="localNode.value" :items="selectedColumn.valueOptions"
                :label="t(`${translationPrefix}filter.value`)" @update:modelValue="emitUpdate" hide-details
                item-title="label" item-value="value" />
            <v-text-field v-else-if="operatorRequiresValue" density="compact" v-model="localNode.value" :label="t(`${translationPrefix}filter.value`)"
                :type="inputFieldType" @input="emitUpdate" hide-details />
        </div>

        <v-btn variant="plain" @click="$emit('remove')" size="small" style="width: 10%;">
            <v-icon color="primary">mdi-delete</v-icon>
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTranslationPrefix } from '@/composables/useTranslationPrefix';
import { useFilterOperatorList } from '@/composables/useFilterOperatorList';
import type {
    QueryBuilderColumnOption,
    QueryBuilderFilterCondition,
    QueryBuilderOperatorOption,
    QueryBuilderOperatorValue
} from '@/types/QueryBuilder';

const { t } = useI18n();
const translationPrefix = useTranslationPrefix();

// Operators that don't require a value input
const valueRequiredOperators = new Set([
    '=', '!=', '>', '<', '>=', '<=', 'contains', 'doesNotContain', 'startsWith',
    'doesNotStartWith', 'endsWith', 'doesNotEndWith', 'matches', 'between', 'notBetween', 'in', 'notIn'
]);

const columnTypeToOperatorSet: Record<string, string> = {
    string: 'string',
    integer: 'numeric',
    number: 'numeric',
    date: 'date',
    datetime: 'date',
    boolean: 'boolean',
    duration: 'numeric',
    custom: 'string',      // fallback, adjust as needed
    component: 'string'    // fallback, adjust as needed
};

function updateColumn(val: string): void {
    localNode.value.columnKey = val;
    emitUpdate();
}

const props = defineProps<{
    node: QueryBuilderFilterCondition;
    operatorType?: string;
    operatorOverrides?: any;
    columnOptions?: QueryBuilderColumnOption[];
}>();
const emit = defineEmits(['update', 'remove']);

const localNode = ref<QueryBuilderFilterCondition>(JSON.parse(JSON.stringify(props.node)));

watch(() => props.node, (val) => {
    localNode.value = JSON.parse(JSON.stringify(val));
});

// Compute operatorType based on selected column
const selectedColumn = computed(() => props.columnOptions?.find(
    column => column.value === localNode.value.columnKey
));

const computedOperatorType = computed(() => {
    return columnTypeToOperatorSet[selectedColumn.value?.type ?? 'string'] || props.operatorType || 'string';
});

const inputFieldType = computed(() => {
    const colType = selectedColumn.value?.type;
    if (colType === 'number' || colType === 'integer' || colType === 'duration') {
        return 'number';
    }
    if (colType === 'date' || colType === 'datetime') {
        return 'date';
    }
    return 'text';
});

const operatorRequiresValue = computed(() => {
    // If column has custom operators, assume they require a value unless proven otherwise
    if (selectedColumn.value?.operators?.length) {
        return true;
    }
    // Otherwise, check against the standard list
    return valueRequiredOperators.has(localNode.value.operator as string);
});

function normalizeConditionValue(requiresValue: boolean) {
    if (!requiresValue) {
        localNode.value.value = null;
        return;
    }

    if (localNode.value.value == null) {
        localNode.value.value = '';
    }
}

const operatorOptions = computed<QueryBuilderOperatorOption[]>(() => {
    if (selectedColumn.value?.operators?.length) {
        return selectedColumn.value.operators;
    }

    return useFilterOperatorList(
        computedOperatorType.value,
        t,
        translationPrefix.value,
        props.operatorOverrides
    );
});

watch(
    operatorOptions,
    (options) => {
        if (!options.length) {
            return;
        }

        const supportedOperators = options.map(option => option.value);
        if (!supportedOperators.includes(localNode.value.operator)) {
            localNode.value.operator = supportedOperators[0] as QueryBuilderOperatorValue;
            emitUpdate();
        }
    },
    { immediate: true }
);

watch(
    operatorRequiresValue,
    (requiresValue) => {
        normalizeConditionValue(requiresValue);
        emitUpdate();
    }
);

function emitUpdate() {
    emit('update', localNode.value);
}
</script>