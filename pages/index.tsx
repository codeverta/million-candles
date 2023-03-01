import { Content, Hero } from 'components'
import Footer from 'components/Footer'
import Layout from 'components/layout/Landing'

export default function Home() {
  return (
    <Layout>
        <Hero/>
        <Content/>
        <Footer/>
    </Layout>
  )
}
