import { Container, Card, Button } from 'react-bootstrap'

const Hero = () => {
  return (
    <div className='py-5'>
        <Container className='d-flex justify-content-center'>
            <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
                <h1 className='text-center mb-4'>InventorySys</h1>
                <p className='text-center mb-4'>
                    MERN Stack equipped with list pagination, sort and filter. It also uses authorization to deliver different content
                </p>
                <div className='d-flex'>
                    <Button variant='primary' href='/product' className='me-3'>
                        Product List
                    </Button>
                </div>
            </Card>
        </Container>
    </div>
  )
}

export default Hero