<template>
    <div>
        <FilterGroup :node="modelValue" @update="updateFilterTree" :column-options="columnOptions" is-root>
            <template #columnDropdown="slotProps">
                <slot name="columnDropdown" v-bind="slotProps"></slot>
            </template>
        </FilterGroup>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import FilterGroup from '@/components/FilterGroup.vue';
import type { QueryBuilderColumnOption, QueryBuilderFilterGroup, QueryBuilderFilterNode } from '@/types/QueryBuilder';

const props = defineProps<{
    modelValue: QueryBuilderFilterGroup;
    columnOptions?: QueryBuilderColumnOption[];
}>();
const emit = defineEmits(['update:modelValue']);

function updateFilterTree(newTree: QueryBuilderFilterNode) {
    emit('update:modelValue', newTree);
}

watch(
    () => props.modelValue,
    (newVal) => {
        emit('update:modelValue', newVal);
    },
    { deep: true }
);
</script>