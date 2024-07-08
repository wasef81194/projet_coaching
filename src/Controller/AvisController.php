<?php

namespace App\Controller;

use App\Entity\Avis;
use App\Form\AvisType;
use App\Repository\AvisRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('api/avis')]
class AvisController extends AbstractController
{
   
    #[Route('/coach/{idCoach}', name: 'app_avis_index', methods: ['GET'])]
    public function avisCoach($idCoach, UserRepository $userRepository, AvisRepository $avisRepository, SerializerInterface $serializer): JsonResponse
    {
        $coach = $userRepository->findOneCoach($idCoach);
        $avis = $avisRepository->findBy(['deleted_at' => NULL, 'coach' => $coach], ['created_at' => 'DESC']);
        $response = $serializer->serialize(
            $avis, 'json', [ AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object) { return null; }]
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('/moyenne/coach/{idCoach}', name: 'app_avis_moyenne', methods: ['GET'])]
    public function noteMoyenneCoach($idCoach, UserRepository $userRepository, AvisRepository $avisRepository, SerializerInterface $serializer): JsonResponse
    {
        $coach = $userRepository->findOneCoach($idCoach);
        $avis = $avisRepository->findBy(['deleted_at' => NULL, 'coach' => $coach]);

        $moyenne = 0;
        foreach ($avis as $avi) {
            $moyenne += $avi->getNote(); 
        }
        $diviser = count($avis);
        if ($moyenne > 0) {
            $moyenne = $moyenne/$diviser;
        }
        

        $response = $serializer->serialize(
            $moyenne, 'json'
        );

        return new JsonResponse($response, 200, [], true);
    }
    
    #[Route('/coach/new', name: 'app_avis_coach_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager,AvisRepository $avisRepository, UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
       //Récupere les données dans un tableau
       $data = json_decode($request->getContent(), true);
       $note = intval($data['note']);
       $commentaire = $data['commentaire'];
       $idUser = $data['idUser'];
       $idCoach = $data['idCoach'];

       //Si le coach existe pas
       $coach = $userRepository->findOneCoach($idCoach);
       if (!$coach) {
            $message = $serializer->serialize(
                [
                    'code' => 400,
                    'message' => 'Coach non trouvé'
                ], 'json'
            );
            return new JsonResponse($message, 400, [], true);
       }
       //Si l'user existe pas
       $user = $userRepository->findOneBy(['id' => $idUser, 'deleted_at' => NULL]);
       if (!$user) {
        $message = $serializer->serialize(
            [
                'code' => 400,
                'message' => 'Vous n\'êtes pas en mesure de laisser un avis'
            ], 'json'
        );
        return new JsonResponse($message, 400, [], true);
   }
      
       //Si la note et non valide
       if ($note < 0 || $note > 5 || !is_int($note)) {
            $message = $serializer->serialize(
                [
                    'code' => 400,
                    'message' => 'Note non valide.'
                ], 'json'
            );
            return new JsonResponse($message, 400, [], true);
       }

       //Si il a deja laisser un avis a ce coach
       $avisExist = $avisRepository->findOneBy(['user' => $user, 'coach' => $coach, 'deleted_at' => NULL]);
       if ($avisExist) {
            $message = $serializer->serialize(
                [
                    'code' => 400,
                    'message' => 'Vous avez déjà laissé un avis à ce coach.'
                ], 'json'
            );
            return new JsonResponse($message, 400, [], true);
       }

       $avis = new Avis();
       $avis->setUser($user);
       $avis->setCoach($coach);
       $avis->setNote($note);
       $avis->setCommentaire($commentaire);
       $avis->setCreatedAt( new \DateTime());
       $entityManager->persist($avis);
       $entityManager->flush();
       $response = $serializer->serialize(
            [
                'code' => 200,
                'message'=> 'Avis ajouté avec succées.'
            ], 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('/{id}', name: 'app_avis_delete', methods: ['POST'])]
    public function delete(Request $request, Avis $avi, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$avi->getId(), $request->request->get('_token'))) {
            $entityManager->remove($avi);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_avis_index', [], Response::HTTP_SEE_OTHER);
    }
}
