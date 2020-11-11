
import React from 'react';

import { withRouter } from 'react-router-dom';
import { registerForLocalization, provideLocalizationService } from '@progress/kendo-react-intl';
import { Drawer, DrawerContent, DrawerItem } from '@progress/kendo-react-layout';

import { Header } from './Header.jsx';


const items = [
    { name: 'dashboard', iconSvg: 'dashboard-icon', selected: true , route: '/' },
    { name: 'planning', iconSvg: 'planning-icon', route: '/planning' },
    { name: 'profile', iconSvg: 'profile-icon', route: '/profile' },
    { separator: true },
    { name: 'info', iconSvg: 'info-icon', route: '/info' }
];

const CustomDrawerItem = (props) => {
    const { iconSvg, text, ...others } = props;
    return (
        <DrawerItem {...others}>
            <span className={'k-icon ' + iconSvg} />
            <span className="k-item-text">{text}</span>
        </DrawerItem>
    );
};

class DrawerRouterContainer extends React.Component {
    state = {
        expanded: true,
        selectedId: items.findIndex(x => x.selected === true),
        isSmallerScreen: window.innerWidth < 768
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeWindow)
        this.resizeWindow()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeWindow)
    }

    resizeWindow = () => {
        this.setState({ isSmallerScreen: window.innerWidth < 768 })
    }

    handleClick = () => {
        this.setState((e) => ({expanded: !e.expanded}));
    }


    handleSelect = (e) => {
        this.setState({selectedId: e.itemIndex, expanded: false});
        this.props.history.push(e.itemTarget.props.route);
    }

    getSelectedItem = (pathName) => {
        let currentPath = items.find(item => item.route === pathName);
        if (currentPath.name) {
            return currentPath.name;
        }
    }
    render() {
        let selected = this.getSelectedItem(this.props.location.pathname);
        const localizationService = provideLocalizationService(this);

        return (
             <React.Fragment>
                <Header
                    onButtonClick={this.handleClick}
                    page={localizationService.toLanguageString(`custom.${selected}`)}
                />
                <Drawer
                    expanded={this.state.expanded}
                    items={items.map((item) => ({
                                ...item,
                                text: localizationService.toLanguageString(`custom.${item.name}`),
                                selected: item.name === selected
                            }))
                    }
                    animation={false}
                    item={CustomDrawerItem}
                    position='start'
                    mode={this.state.isSmallerScreen ? 'overlay' : 'push'}
                    mini={this.state.isSmallerScreen ? false : true}

                    onOverlayClick={this.handleClick}
                    onSelect={this.handleSelect}
                >
                    <DrawerContent>
                        {this.props.children}
                    </DrawerContent>
                </Drawer>
        </React.Fragment>
        );
    }
};

registerForLocalization(DrawerRouterContainer);

export default withRouter(DrawerRouterContainer);

