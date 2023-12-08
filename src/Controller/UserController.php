<?php

namespace App\Controller;
use App\Entity\Image;
use App\Entity\User;
use App\Repository\ImageRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class UserController extends AbstractController
{
    #[Route('api/coachs/', name: 'api_coachs')]
    public function coachs(UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {   
        //On récupere tout les users avec un role coach
        $userCoachs = $userRepository->getUserByRole('ROLE_COACH');

        $coachs = $serializer->serialize(
            $userCoachs, 'json'
        );
        return new JsonResponse($coachs, 200, [], true);
    }

    #[Route('api/coachs', name: 'api_coachs_limited', methods:'POST')]
    public function coachsLimited(Request $request, UserRepository $userRepository, SerializerInterface $serializer):JsonResponse
    {   
        //Récupere les données dans un tableau
        $data = json_decode($request->getContent(), true);
        //On récupere tout les users avec un role coach
        $userCoachs = $userRepository->getUserByRole('ROLE_COACH');
        if(isset($data['postalCode']) && !is_null($data['postalCode'])){
            $villes = VilleController::getVillesVoisin($data['postalCode'], $data['rayon']);
            $codePostal = [];
            //Recupere le code postale de chaque ville du rayon données
            foreach ($villes as $ville) {
                $codePostal[] = $ville->code_postal;
            }
            
            //Si le coach ne fait pas partie de ce code postal on le supprime du tableau 
            foreach ($userCoachs as $key => $coach) {
                if(!is_null($coach->getPostalCode()) && !in_array($coach->getPostalCode(), $codePostal)){
                    unset($userCoachs[$key]);
                }
            }
            //Recalcul les clés du tableau 
            $userCoachs = array_values($userCoachs);
        }

        if(!is_null($data['maxResults'])){
            $userCoachs = array_slice($userCoachs, 0, $data['maxResults']); 
        }

        $coachs = $serializer->serialize(
            $userCoachs, 'json'
        );
        return new JsonResponse($coachs, 200, [], true);
    }

    #[Route('api/coach/{id}', name: 'api_coach', methods:'GET')]
    public function coach($id, UserRepository $userRepository, SerializerInterface $serializer):JsonResponse
    {
        $coach = $userRepository->findOneCoach($id);
        if ($coach) {
            $response = $serializer->serialize(
                $coach, 'json'
            );
            $code = 200;        }
        else{
            $response = $serializer->serialize(
                $coach, 'json'
            );
            $code = 400;
        }
        return new JsonResponse($response, $code, [], true);
    }

    #[Route('api/edit/user', name: 'api_edit_user', methods:'POST')]
    public function edit(Request $request, EntityManagerInterface $entityManager,  MailerInterface $mailer, UserRepository $userRepository, ImageRepository $imageRepository, SerializerInterface $serializer): JsonResponse
    {
        //Récupere les données dans un tableau
        $data = json_decode($request->getContent(), true);
        $user = $userRepository->findOneBy(['id' => $data['id'], 'deleted_at' => NULL]);
        $imageCover = $imageRepository->findOneBy(['user' =>$data['id'], 'detail' => 'cover', 'deleted_at' => NULL]);
        $imageProfil = $imageRepository->findOneBy(['user' =>$data['id'], 'detail' => 'profil', 'deleted_at' => NULL]);

        //Traitement des données
        $data['email'] = strip_tags(trim($data['email']));
        $data['address'] = strip_tags(trim($data['address']));
        $data['city'] = strip_tags(trim($data['city']));
        $data['postalCode'] = strip_tags(trim($data['postalCode']));
        $data['firstname'] = strip_tags(trim($data['firstname']));
        $data['lastname'] = strip_tags(trim($data['lastname']));
        $data['description'] = strip_tags(trim($data['description']));
        $messageEmail = '';
        //Si on a changer la photo de couverture;
        $dataImgCover  = substr($data['imageCover'], 0, 4);
        if ($dataImgCover == 'data') {
            //Importe la photo
            $response = ImageController::importImageBase64($data['imageCover'], $this->getParameter('images_directory'));
            if($response['code'] == 200){
                $data['imageCover'] = $response['file'];
                //Si il existe déjà un image on la supprime
                if($imageCover){
                    //Supprime dans la bdd la photo de couverture
                    $imageCover->setDeletedAt(new \DateTime());
                    $imageCover->setDeletedBy($user->getId());
                    $entityManager->persist($imageCover);
                    $entityManager->flush();
                }
                //Creer une nouvelle image en bdd
                $imageCover = new Image();
                $imageCover->setUser($user);
                $imageCover->setCreatedAt(new \DateTime());
                $imageCover->setDetail('cover');
                $imageCover->setPath($data['imageCover']);
                $entityManager->persist($imageCover);
                $entityManager->flush();
            }
            else{
                return new JsonResponse($response['message'], $response['code'], [], true);
            }
        }
        //Si on a changer la photo de profil;
        $dataImgProfil  = substr($data['imageProfil'], 0, 4);
        if ($dataImgProfil == 'data') {
            //Importe la photo
            $response = ImageController::importImageBase64($data['imageProfil'], $this->getParameter('images_directory'));
            if($response['code'] == 200){
                $data['imageProfil'] = $response['file'];
                //Si il existe déjà un image on la supprime
                if($imageProfil){
                    //Supprime dans la bdd la photo de profil
                    $imageProfil->setDeletedAt(new \DateTime());
                    $imageProfil->setDeletedBy($user->getId());
                    $entityManager->persist($imageProfil);
                    $entityManager->flush();
                }
                
                //Creer une nouvelle image en bdd
                $imageProfil = new Image();
                $imageProfil->setUser($user);
                $imageProfil->setCreatedAt(new \DateTime());
                $imageProfil->setDetail('profil');
                $imageProfil->setPath($data['imageProfil']);
                $entityManager->persist($imageProfil);
                $entityManager->flush();
            }
            else{
                return new JsonResponse($response['message'], $response['code'], [], true);
            }
        }

        //Si l'email à été modifié
        if($user->getEmail() != $data['email']){

            //Effectue une verifaction sur l'email
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $message = $serializer->serialize(
                    [
                        'code' => 400,
                        'message' => 'Cette adresse email n\'est pas valide'
                    ], 'json'
                );
                return new JsonResponse($message, 400, [], true);
            }

            //Si un utilisateur n'as pas déja cette email 
            $userExist = $userRepository->findOneBy(['email' => $data['email'], 'deleted_at' => NULL]);
            if (!is_null($userExist)) {
                $message = $serializer->serialize(
                    [
                        'code' => 401,
                        'message' => 'Cette adresse email est déjà utilisé'
                    ], 'json'
                );
                return new JsonResponse($message, 401, [], true);
            }
            //Envoie du mail pour prouver son identité et désactive son compte en attendant 
            //Génere une clé
            $key = md5(uniqid(rand(), true));
            $user->setEmail($data['email']);
            $user->setActive(0);
            $user->setKeyRegister($key);
            //Envoie d'un mail 
            if (!MailController::sendEmailVerify($mailer, $data['email'], $key)) {
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Une erreur est survenue lors de la modification du mail. Veuilliez réessayer ultérieurement.'
                    ], 'json'
                );
                return new JsonResponse($message, 404, [], true);
            }
            $messageEmail = 'Veuilliez confirmer votre adresse e-mail.';
        }
        if ($user->getAddress() != $data['address']) {
            $user->setAddress($data['address']);
        }
        if ($user->getCity() != $data['city']) {
            $user->setCity($data['city']);
        }
        if ($user->getPostalCode() != $data['postalCode']) {
            $user->setPostalCode($data['postalCode']);
        }
        if ($user->getFirstname() != $data['firstname']) {
            $user->setFirstname($data['firstname']);
        }
        if ($user->getLastname() != $data['lastname']) {
            $user->setLastname($data['lastname']);
        }
        if ($user->getDescription() != $data['description']) {
            $user->setDescription($data['description']);
        }
        $entityManager->persist($user);
        $entityManager->flush();
        $response = $serializer->serialize(
            [
                'code' => 200,
                'message'=> 'Modification réussie. '.$messageEmail
            ], 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/user/{userId}', name: 'api_user')]
    public function user($userId, UserRepository $userRepository, SerializerInterface $serializer):JsonResponse
    {
        //On récupere l'utilisateur pas supprimer
        $user = $userRepository->findOneBy(['id' => $userId, 'deleted_at' => NULL]);
        $response = $serializer->serialize($user, 'json');
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/auth/user', name: 'api_auth_user', methods:'POST')]
    public function tryToLogin(Request $request, UserPasswordHasherInterface $passwordHasher, UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        //Récupere les données dans un tableau
        $data = json_decode($request->getContent(), true);

        //Traitement data (eneleve les espaces et les balises)
        $data['email'] = strip_tags(trim($data['email']));
        $data['password'] = strip_tags(trim($data['password']));

        //Envoie du formulaire
        if ($data['auth']) {
            if (empty($data['email']) && empty($data['password'])) {
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Veuilliez remplir tout les champs'
                    ], 'json'
                );
                return new JsonResponse($message, 404, [], true);
            }
            $user = $userRepository->findOneBy(['email'=>$data['email']]);

            //Si il n'a pas trouvé d'user
            if(!$user){
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Votre adresse e-mail n\'est pas correct. '
                    ], 'json'
                );
                return new JsonResponse($message, 404, [], true);
            }
            //Si le compte n'est pas activé
            if (!$user->isActive()) {
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Votre adresse e-mail n\'as pas été vérifié'
                    ], 'json'
                );
                return new JsonResponse($message, 404, [], true);
            }

            if ($user && $passwordHasher->isPasswordValid($user, $data['password'])) {
                $message = $serializer->serialize(
                    [
                        'code' => 200,
                        'message' => 'Connexion réussie',
                        'user' => $user
                    ], 'json'
                );
                return new JsonResponse($message, 200, [], true);
            }
            else{
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Email ou mot de passe incorrect'
                    ], 'json'
                );
                return new JsonResponse($message, 404, [], true);
            }
        }
        $message = $serializer->serialize(
            [
                'code' => 404,
                'message'=> 'Une erreur est survenue veuillez réessayer'
            ], 'json'
        );
        return new JsonResponse($message, 404, [], true);
    }

    #[Route('api/register/user', name: 'api_register_user', methods:'POST')]
    public function register(MailerInterface $mailer, Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager, UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {

        //Récupere les données dans un tableau
        $data = json_decode($request->getContent(), true);

        //Traitement data (eneleve les espaces et les balises)
        $data['email'] = strip_tags(trim($data['email']));
        $data['password'] = strip_tags(trim($data['password']));
        $data['firstName'] = strip_tags(trim($data['firstName']));
        $data['lastName'] = strip_tags(trim($data['lastName']));

        //Si la requêtes est faites pour créer un nouvelle user
        if ($data['newUser']) {
            if (empty($data['email']) || empty($data['password']) || empty($data['firstName']) || empty($data['lastName'])) {
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Veuilliez remplir tout les champs'
                    ], 'json'
                );
                return new JsonResponse($message, 404, [], true);
            }
            //Effectue une verifaction sur l'email
            $userExist = $userRepository->findOneBy(['email' => $data['email'], 'deleted_at' => NULL]);
            if (!is_null($userExist)) {
                $message = $serializer->serialize(
                    [
                        'code' => 401,
                        'message' => 'Cette adresse email est déjà utilisé'
                    ], 'json'
                );
                return new JsonResponse($message, 401, [], true);
            }
            //Verification mot de passe
            if ($data['confirmPassword'] != $data['password']) {
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Les deux mot de passe ne correspondent pas'
                    ], 'json'
                );
                return new JsonResponse($message, 404, [], true);
            }
            //Verification du role
            if (empty($data['roles'][0])) {
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Veuillez préciser si vous êtes coach ou utilisateur'
                    ], 'json'
                );
                return new JsonResponse($message, 401, [], true);
            }
            //Génere une clé
            $key = md5(uniqid(rand(), true));
            //Envoie d'un mail 
            if (!MailController::sendEmailRegister($mailer, $data['email'], $key)) {
                $message = $serializer->serialize(
                    [
                        'code' => 404,
                        'message' => 'Une erreur est survenue veuilliez réessayer ultérieurement.'
                    ], 'json'
                );
                return new JsonResponse($message, 404, [], true);
            }
            //On enregistre un nouvelle utilisateur
            $user = new User();
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $data['password']
            );
            $user->setKeyRegister($key);
            $user->setEmail(strtolower($data['email']));
            $user->setRoles($data['roles']);
            $user->setPassword($hashedPassword);
            $user->setFirstName(ucfirst(strtolower($data['firstName'])));
            $user->setLastName(ucfirst(strtolower($data['lastName'])));
            $user->setCreatedAt(new \DateTime($data['createdAt']));
            $user->setActive(0);
            $entityManager->persist($user);
            $entityManager->flush();
            $message = $serializer->serialize(
                [
                    'code' => 200,
                    'user' => $user, 
                    'message'=> 'Inscription réussie. Veuilliez confirmer votre adresse e-mail.'
                ], 'json'
            );
            
            return new JsonResponse($message, 200, [], true);
        }
        $message = $serializer->serialize(
            [
                'code' => 404,
                'message'=> 'Une erreur est survenue veuillez réessayer'
            ], 'json'
        );
        return new JsonResponse($message, 404, [], true);
    }

    #[Route('/register/confirm/{key}', name: 'confirm_account_user', methods:'GET')]
    public function confirmAccount($key, UserRepository $userRepository, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        //On récupere l'utilisateur liés à la clé 
        $user = $userRepository->findOneBy(['key_register' => $key]);
        if ($user) {
            $user->setKeyRegister(NULL);
            $user->setActive(1);
            $entityManager->persist($user);
            $entityManager->flush();
            MailController::sendEmailAccountActive($mailer, $user);
        }
        return $this->renderForm('user/register/confirm.html.twig', ['user' => $user, 'link' => $_ENV['APP_LOCAL'].'#/auth']);
    }
}
