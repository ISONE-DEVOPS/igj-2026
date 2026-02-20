import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import { useNProgress } from './useNProgress';
export function withNProgress(BaseComponent) {
    const WithNProgress = (props) => {
        const hookProps = useNProgress(props);
        return React.createElement(BaseComponent, { ...props, ...hookProps });
    };
    hoistNonReactStatics(WithNProgress, BaseComponent);
    return WithNProgress;
}
