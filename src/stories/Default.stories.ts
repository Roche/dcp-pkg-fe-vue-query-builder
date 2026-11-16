import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import QueryBuilder from "@/components/QueryBuilder.vue";
import type { QueryBuilderColumnOption } from "@/types/QueryBuilder";

const mixedTypeColumnOptions: QueryBuilderColumnOption[] = [
    { label: "Customer Name", value: "customerName", type: "string" },
    { label: "Order Total", value: "orderTotal", type: "number" },
    { label: "Created On", value: "createdOn", type: "date" },
    { label: "Is Active", value: "isActive", type: "boolean" }
];

const sensorColumnOptions: QueryBuilderColumnOption[] = [
    ...mixedTypeColumnOptions,
    {
        label: "Sensor",
        value: "sensorId",
        type: "string",
        operators: [
            { label: "is equal to sensor", value: "equalsSensor" },
            { label: "is not equal to sensor", value: "notEqualsSensor" }
        ],
        valueEditor: "select",
        valueOptions: [
            { label: "Sensor A", value: "sensor-a" },
            { label: "Sensor B", value: "sensor-b" },
            { label: "Sensor C", value: "sensor-c" }
        ]
    }
];

const meta: Meta<typeof QueryBuilder> = {
    title: "Default",
    component: QueryBuilder,
};
export default meta;

const Template: StoryFn<typeof QueryBuilder> = (args) => ({
    components: { QueryBuilder },
    setup() {
        const filterTree = ref({
            type: "group",
            operator: "and",
            filters: []
        });

        return { args, filterTree };
    },
    template: `
      <div>
    <QueryBuilder v-model="filterTree" :column-options="args.columnOptions" />
        <h3>Current Filter Tree Value:</h3>
        <pre>{{ JSON.stringify(filterTree, null, 2) }}</pre>
      </div>
    `,
});

export const Default = Template.bind({});

Default.args = {
    columnOptions: mixedTypeColumnOptions
};

export const ColumnTypeOperators = Template.bind({});

ColumnTypeOperators.args = {
    columnOptions: mixedTypeColumnOptions
};

ColumnTypeOperators.render = (args) => ({
    components: { QueryBuilder },
    setup() {
        const filterTree = ref({
            type: "group",
            operator: "and",
            filters: [
                {
                    type: "condition",
                    columnKey: "customerName",
                    operator: "contains",
                    value: "Ada"
                },
                {
                    type: "condition",
                    columnKey: "orderTotal",
                    operator: ">=",
                    value: 100
                },
                {
                    type: "condition",
                    columnKey: "createdOn",
                    operator: "between",
                    value: "2026-01-01 to 2026-12-31"
                },
                {
                    type: "condition",
                    columnKey: "isActive",
                    operator: "isTrue",
                    value: ""
                }
            ]
        });

        return { args, filterTree };
    },
    template: `
    <div>
    <QueryBuilder v-model="filterTree" :column-options="args.columnOptions" />
    <h3>Current Filter Tree Value:</h3>
    <pre>{{ JSON.stringify(filterTree, null, 2) }}</pre>
    </div>
  `,
});

ColumnTypeOperators.parameters = {
    docs: {
        description: {
            story: "Preloads string, numeric, date, and boolean columns so you can verify the operator dropdown changes with the selected column type."
        }
    }
};

export const CustomColumnOperators = Template.bind({});

CustomColumnOperators.args = {
    columnOptions: sensorColumnOptions
};

CustomColumnOperators.render = (args) => ({
    components: { QueryBuilder },
    setup() {
        const filterTree = ref({
            type: "group",
            operator: "and",
            filters: [
                {
                    type: "condition",
                    columnKey: "sensorId",
                    operator: "equalsSensor",
                    value: "sensor-b"
                }
            ]
        });

        return { args, filterTree };
    },
    template: `
    <div>
    <QueryBuilder v-model="filterTree" :column-options="args.columnOptions" />
    <h3>Current Filter Tree Value:</h3>
    <pre>{{ JSON.stringify(filterTree, null, 2) }}</pre>
    </div>
  `,
});

CustomColumnOperators.parameters = {
    docs: {
        description: {
            story: "Shows a column with custom operators and a dropdown value editor, while the default type-based columns continue to work unchanged."
        }
    }
};