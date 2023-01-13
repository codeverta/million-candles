import styles from '../styles/Home.module.css'
import Image from 'next/image'
import contohImage from '../public/assets/lilin.png'
import Stars from './Stars'
import Link from 'next/link'
import { Modal } from './'
import { useEffect, useState } from 'react'
import supabase from '../utils/db'


export default function Content() {
  const [ isModalOpen, setIsModalOpen ] = useState<Boolean>(false);
  const [ isLoading, setIsLoading ] = useState<Boolean>(false)
  const [ products, setProducts ] = useState<any>([])
  const [ selectedProduct, setSelectedProduct ] = useState({}) 
    useEffect(() => {
        fetchProducts()
    },[])

    const fetchProducts = async () => {
        setIsLoading(true)
        const { data }  = await supabase
            .from('products')
            .select(`
                name,
                uuid,
                price,
                documents (
                    url
                )
            `)
            .eq('documents.type', 'image')
        setIsLoading(false)
        setProducts(data)
    }

    const handleModal = (product: any): void => {
        setIsModalOpen(true)
        setSelectedProduct(product)
    }
    return (
        <>
        { isModalOpen && (
            <Modal>
               <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Terms of Service
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="p-6 space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                        </p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                        </p>
                    </div>
                    {/* <!-- Modal footer --> */}
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button data-modal-hide="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                        <button data-modal-hide="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                    </div>
                </div>
            </Modal>
        )}
        <main>
            <h2 className="mb-4 py-20 text-center text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Produk Kami</h2>
            <article className="flex justify-center">
                { !isLoading ? (
                    <>
                        { products?.map((product: any) => {
                            const [ document ] = product.documents
                            return (
                            <div key={product.uuid} className="w-full max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <button onClick={() => handleModal(product)}>
                                    <img className="p-8 rounded-t-xl" src={document.url} alt="product image" />
                                </button>
                                <div className="px-5 pb-5">
                                    <a href="#">
                                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                                    </a>
                                    <Stars/>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">Rp {product.price}</span>
                                        <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>
                                    </div>
                                </div>
                            </div>
                            )}
                        )}
                    </>
                ) : null}
            </article>
      </main>
        </>
    )
}