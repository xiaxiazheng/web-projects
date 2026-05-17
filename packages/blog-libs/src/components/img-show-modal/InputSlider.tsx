import React, { useState } from 'react';
import { ConfigProvider, InputNumber, Slider } from 'antd';

interface InputSliderProps {
  max: number;
  min: number;
  value: number;
  onChange: (value: number) => void;
}

const InputSlider: React.FC<InputSliderProps> = (props) => {
  const { max, min, value, onChange } = props;

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <ConfigProvider
        theme={{
          components: {
            Slider: {
              /* 这里是你的组件 token */
              // controlSize: 14,
              // dotSize: 8,
              // handleLineWidth: 6,
              // handleLineWidthHover: 8,
              handleSize: 14,
              handleSizeHover: 14,
              railSize: 8,
            },
          },
        }}>
        <Slider
          style={{ width: '100%', margin: 0 }}
          min={min}
          max={max}
          onChange={onChange}
          value={value}
          step={0.01}
          tooltip={{
            open: false
          }}
        />
      </ConfigProvider>
      <InputNumber
        min={min}
        max={max}
        style={{ margin: '0 0 0 16px' }}
        value={value}
        onChange={e => onChange(e || min)}
        step={0.01}
      />
    </div>
  );
};

export default InputSlider;