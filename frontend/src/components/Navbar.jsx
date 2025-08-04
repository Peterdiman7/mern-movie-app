import { Container, Flex, HStack, Text, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const Navbar = () => {
	return (
		<Container maxW={'1140px'} px={4}>
			<Flex
				h={16}
				alignItems={'center'}
				justifyContent={'space-between'}
				flexDir={{
					base: 'column',
					sm: 'row'
				}}
			>
				<Text
					fontSize={{ base: '22', sm: '28' }}
					fontWeight={'bold'}
					textTransform={'uppercase'}
					textAlign={'center'}
					bgGradient={'linear(to-r, cyan.400, blue.500)'}
					bgClip={'text'}
				>
					<Link to={'/'}>Movie Store 🛒</Link>
				</Text>

				<HStack spacing={2} alignItems={'center'}>
					<Link to={'/create'}>
						<Button
							bg={'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
							color={'white'}
							_hover={{
								transform: 'translateY(-2px)',
								boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
							}}
							transition={'all 0.3s ease'}
							borderRadius={'25px'}
							fontWeight={'600'}
							px={6}
						>
							🎬 Create Movie
						</Button>
					</Link>
				</HStack>

			</Flex>
		</Container>
	)
}

export default Navbar