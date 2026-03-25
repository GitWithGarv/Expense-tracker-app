import { Layout, theme } from "antd";


const Homelayout = ({children}) => {

    const {
        token: {colorBgContainer, borderRadiusLG}
    } = theme.useToken();

    return (
        <Layout>
            <Layout.Header className="bg-[#FF735C]! flex items-center justify-center">
                <h1 className="text-white text-lg md:text-3xl font-bold text-center">
                    Expense Tracker App
                </h1>
            </Layout.Header>

            <Layout.Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG
            }}>
                {children}
            </Layout.Content>

            <Layout.Footer className="bg-[#FF735C]! flex items-center justify-center">
                <h1 className="text-white text-lg md:text-3xl font-bold text-center">
                    Footer
                </h1>
            </Layout.Footer>
        </Layout>
    )
}

export default Homelayout
