<template>
    <div class="filter-group p-2 border rounded mt-2">
        <div class="flex justify-between items-center gap-2 mb-2">
            <v-select v-model="localNode.operator" density="compact" :items="groupOptions"
                :label="t(`${translationPrefix}filter.label.groupOperator`)" hide-details />

            <v-tooltip :text="t(`${translationPrefix}filter.label.add-condition`)" location="top">
                <template #activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" variant="plain" @click="addCondition" size="small">
                        <v-icon color="primary">mdi-filter-plus</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

            <v-tooltip :text="t(`${translationPrefix}filter.label.add-group`)" location="top">
                <template #activator="{ props: tooltipProps }">
                    <v-btn v-bind="tooltipProps" variant="plain" @click="addGroup" size="small">
                        <v-icon color="primary">mdi-playlist-plus</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </div>
        <div class="filters">
            <template v-for="(child, idx) in localNode.filters" :key="idx">
                <FilterCondition v-if="child.type === 'condition'" :node="child" @update="updateChild(idx, $event)"
                    @remove="removeChild(idx)" :column-options="columnOptions">
                    <template #columnDropdown="slotProps">
                        <slot name="columnDropdown" v-bind="{
                            ...slotProps,
                            columnKey: String(slotProps.columnKey)
                        }"></slot>
                    </template>
                </FilterCondition>
                <FilterGroup v-else :node="child" @update="updateChild(idx, $event)" :column-options="columnOptions"
                    @remove="removeChild(idx)">
                    <template #columnDropdown="slotProps">
                        <slot name="columnDropdown" v-bind="slotProps"></slot>
                    </template>
                </FilterGroup>
            </template>
        </div>
        <DcpTextButton v-if="canRemove" @click="$emit('remove')">
            {{ t(`${translationPrefix}filter.label.remove-group`) }}
        </DcpTextButton>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import FilterCondition from '@/components/FilterCondition.vue';
import { useI18n } from 'vue-i18n';
import { useTranslationPrefix } from '@/composables/useTranslationPrefix';
import type { PropType } from 'vue';
import type { ColumnDropdownSlotProps } from '@/types/FilterImplementation';
import type { QueryBuilderColumnOption, QueryBuilderFilterGroup, QueryBuilderFilterNode } from '@/types/QueryBuilder';

const { t } = useI18n();
const translationPrefix = useTranslationPrefix();
const groupOptions = computed(() => [
    { value: 'and', title: t(`${translationPrefix.value}filter.groupOperator.and`) },
    { value: 'or', title: t(`${translationPrefix.value}filter.groupOperator.or`) }
]);

defineSlots<{
    columnDropdown(props: ColumnDropdownSlotProps): any;
}>();

const props = defineProps({
    node: {
        type: Object as PropType<QueryBuilderFilterGroup>,
        default: null
    },
    isRoot: {
        type: Boolean,
        default: false
    },
    columnOptions: {
        type: Array as PropType<QueryBuilderColumnOption[]>,
        default: () => []
    }
});
const emit = defineEmits(['update', 'remove']);

const localNode = ref<QueryBuilderFilterGroup>(JSON.parse(JSON.stringify(props.node ?? {
    type: 'group',
    operator: 'and',
    filters: []
})));

watch(() => props.node, (val) => {
    localNode.value = JSON.parse(JSON.stringify(val ?? {
        type: 'group',
        operator: 'and',
        filters: []
    }));
});

watch(
    () => localNode.value?.operator,
    () => {
        if (localNode.value) emitUpdate();
    }
);

function emitUpdate() {
    emit('update', localNode.value);
}

function addCondition() {
    localNode.value.filters.push({
        type: 'condition',
        columnKey: '',
        operator: '=',
        value: ''
    });
    emitUpdate();
}

function addGroup() {
    localNode.value.filters.push({
        type: 'group',
        operator: 'and',
        filters: []
    });
    emitUpdate();
}

function updateChild(idx: number, updated: QueryBuilderFilterNode) {
    localNode.value.filters[idx] = updated;
    emitUpdate();
}

function removeChild(idx: number) {
    localNode.value.filters.splice(idx, 1);
    emitUpdate();
}

const canRemove = computed(() => !!emit && !!emit.length && !props.isRoot);
</script>