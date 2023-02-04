
// import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic';
const DynamicMap = dynamic(() => import('/components/Map'), {
  ssr: false
});

export default function Address(props) {
	return (
		<main>
			<DynamicMap {...props} />
		</main>
	)
}
