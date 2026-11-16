import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import FilterCondition from '../FilterCondition.vue';

const columnOptions = [
  { label: 'Customer Name', value: 'customerName', type: 'string' },
  { label: 'Order Total', value: 'orderTotal', type: 'number' },
  { label: 'Created On', value: 'createdOn', type: 'date' },
  { label: 'Is Active', value: 'isActive', type: 'boolean' }
];

const sensorColumnOptions = [
  {
    label: 'Sensor',
    value: 'sensorId',
    type: 'string',
    operators: [
      { label: 'is equal to sensor', value: 'equalsSensor' },
      { label: 'is not equal to sensor', value: 'notEqualsSensor' }
    ],
    valueEditor: 'select' as const,
    valueOptions: [
      { label: 'Sensor A', value: 'sensor-a' },
      { label: 'Sensor B', value: 'sensor-b' }
    ]
  }
];

const VSelectStub = defineComponent({
  name: 'VSelect',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  template: '<div />'
});

const VTextFieldStub = defineComponent({
  name: 'VTextField',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  emits: ['update:modelValue', 'input'],
  template: '<div />'
});

function getOperatorItems(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAllComponents(VSelectStub)[1].props('items') as Array<{ value: string }>;
}

function getOperatorValue(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAllComponents(VSelectStub)[1].props('modelValue') as string;
}

function getValueItems(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAllComponents(VSelectStub)[2].props('items') as Array<{ label: string; value: string }>;
}

function getValueFieldType(wrapper: ReturnType<typeof mount>) {
  const valueField = wrapper.findAllComponents(VTextFieldStub).find(comp => {
    return comp.props('type') !== undefined;
  });
  return valueField?.props('type') as string | undefined;
}

describe('FilterCondition.vue', () => {
  it('uses operator options based on the selected column type', async () => {
    const wrapper = mount(FilterCondition, {
      props: {
        node: {
          type: 'condition',
          columnKey: 'customerName',
          operator: '=',
          value: ''
        },
        columnOptions
      },
      global: {
        stubs: {
          VSelect: VSelectStub,
          VTextField: VTextFieldStub,
          VBtn: true,
          VIcon: true
        }
      }
    });

    expect(getOperatorItems(wrapper).map(option => option.value)).toEqual([
      '=', '!=', 'contains', 'doesNotContain', 'startsWith', 'doesNotStartWith', 'endsWith', 'doesNotEndWith',
      'matches', 'isNull', 'isNotNull', 'empty', 'notEmpty', 'in', 'notIn'
    ]);

    wrapper.findAllComponents(VSelectStub)[0].vm.$emit('update:modelValue', 'isActive');
    await nextTick();

    expect(getOperatorItems(wrapper).map(option => option.value)).toEqual([
      'isTrue', 'isFalse', 'isNull', 'isNotNull'
    ]);
    expect(getOperatorValue(wrapper)).toBe('isTrue');
  });

  it('supports column-specific operators and a select value editor', () => {
    const wrapper = mount(FilterCondition, {
      props: {
        node: {
          type: 'condition',
          columnKey: 'sensorId',
          operator: 'equalsSensor',
          value: 'sensor-a'
        },
        columnOptions: sensorColumnOptions
      },
      global: {
        stubs: {
          VSelect: VSelectStub,
          VTextField: VTextFieldStub,
          VBtn: true,
          VIcon: true
        }
      }
    });

    expect(getOperatorItems(wrapper)).toEqual([
      { label: 'is equal to sensor', value: 'equalsSensor' },
      { label: 'is not equal to sensor', value: 'notEqualsSensor' }
    ]);
    expect(getOperatorValue(wrapper)).toBe('equalsSensor');
    expect(getValueItems(wrapper)).toEqual([
      { label: 'Sensor A', value: 'sensor-a' },
      { label: 'Sensor B', value: 'sensor-b' }
    ]);
  });

  it('applies correct input type based on column type', () => {
    const testCases = [
      { columnKey: 'orderTotal', expectedType: 'number' },
      { columnKey: 'createdOn', expectedType: 'date' },
      { columnKey: 'customerName', expectedType: 'text' }
    ];

    testCases.forEach(({ columnKey, expectedType }) => {
      const wrapper = mount(FilterCondition, {
        props: {
          node: {
            type: 'condition',
            columnKey,
            operator: '=',
            value: ''
          },
          columnOptions
        },
        global: {
          stubs: {
            VSelect: VSelectStub,
            VTextField: VTextFieldStub,
            VBtn: true,
            VIcon: true
          }
        }
      });

      expect(getValueFieldType(wrapper)).toBe(expectedType);
    });
  });

  it('hides value field for operators that do not require a value', async () => {
    const wrapper = mount(FilterCondition, {
      props: {
        node: {
          type: 'condition',
          columnKey: 'isActive',
          operator: 'isTrue',
          value: ''
        },
        columnOptions
      },
      global: {
        stubs: {
          VSelect: VSelectStub,
          VTextField: VTextFieldStub,
          VBtn: true,
          VIcon: true
        }
      }
    });

    // For isTrue operator, value field should not be rendered
    const valueFields = wrapper.findAllComponents(VTextFieldStub);
    expect(valueFields.length).toBe(0);

    // Switch to an operator that requires a value
    wrapper.findAllComponents(VSelectStub)[1].vm.$emit('update:modelValue', 'isNull');
    await nextTick();
    // isNull also doesn't require a value
    expect(wrapper.findAllComponents(VTextFieldStub).length).toBe(0);

    // Switch to a numeric column with an operator that requires a value
    wrapper.findAllComponents(VSelectStub)[0].vm.$emit('update:modelValue', 'orderTotal');
    await nextTick();
    // After switching to numeric and operators update, if we pick an operator that requires value
    // the field should be visible
    const operators = wrapper.findAllComponents(VSelectStub)[1].props('items') as Array<{ value: string }>;
    const requiresValueOp = operators.find(op => op.value === '=');
    if (requiresValueOp) {
      wrapper.findAllComponents(VSelectStub)[1].vm.$emit('update:modelValue', '=');
      await nextTick();
      expect(wrapper.findAllComponents(VTextFieldStub).length).toBeGreaterThan(0);
    }
  });

  it('clears the condition value when switching to a no-value operator', async () => {
    const wrapper = mount(FilterCondition, {
      props: {
        node: {
          type: 'condition',
          columnKey: 'customerName',
          operator: '=',
          value: 'Alice'
        },
        columnOptions
      },
      global: {
        stubs: {
          VSelect: VSelectStub,
          VTextField: VTextFieldStub,
          VBtn: true,
          VIcon: true
        }
      }
    });

    wrapper.findAllComponents(VSelectStub)[1].vm.$emit('update:modelValue', 'isNull');
    await nextTick();

    const updates = wrapper.emitted('update');
    expect(updates).toBeTruthy();
    const latestUpdate = updates?.[updates.length - 1]?.[0];
    expect(latestUpdate).toMatchObject({
      type: 'condition',
      columnKey: 'customerName',
      operator: 'isNull',
      value: null
    });
  });
});