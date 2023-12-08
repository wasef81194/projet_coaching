<?php
namespace App\Controller;

use App\Entity\Reservation;
use App\Repository\ReservationRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ReservationController extends AbstractController
{
    
    #[Route('api/new/reservation', name: 'app_new_reservation', methods:'POST')]
    public function new(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer, UserRepository $userRepository): Response
    {
        //Récupere les données dans un tableau
        $data = json_decode($request->getContent(), true);
        //Verifie que l'id user existe et que l'id coach existe
        $user = $userRepository->findOneBy(['id' => $data['idUser'],'deleted_at' => NULL]);
        $coach = $userRepository->findOneBy(['id' => $data['idCoach'],'deleted_at' => NULL]);
        if (!$data['idUser'] || !$user && !$data['idCoach'] || !$coach ){
            $message = $serializer->serialize(
                [
                    'code' => 400,
                    'message' => 'Erreur d\'identification.'
                ], 'json'
            );
            return new JsonResponse($message, 400, [], true);
        }

        //Si la date est vide 
        if (empty($data['date']) || is_null($data['date'])) {
            $message = $serializer->serialize(
                [
                    'code' => 400,
                    'message' => 'Veuillez choisir une date.'
                ], 'json'
            );
            return new JsonResponse($message, 400, [], true);
        }
        $date = explode('/', $data['date']);
        $horraire = explode(' - ',  $date[1]);


        $dateCommence = new \DateTime($date[0].' '.$horraire[0]);
        $dateFin = new \DateTime($date[0].' '.$horraire[1]);
        $reservation = new Reservation();
        $reservation->setUser($user);
        $reservation->setCoach($coach);
        $reservation->setCommence($dateCommence);
        $reservation->setFin($dateFin);
        $reservation->setConfirm(0);
        $entityManager->persist($reservation);
        $entityManager->flush();

        

        $message = $serializer->serialize(
            [
                'code' => 200,
                'message' => 'Séance enregistrer avec '.$coach->getFirstname().' '.$coach->getLastname().'. Le '.$dateCommence->format('d-m-Y H:i')
            ], 'json'
        );
        return new JsonResponse($message, 200, [], true);
    }

    #[Route('api/reservation/disponible/{idCoach}', name: 'app_reservation')]
    public function planningReservation($idCoach, ReservationRepository $reservationRepository, SerializerInterface $serializer, EntityManagerInterface $entityManager): Response
    {
        
        $reservations = $reservationRepository->findBy(['coach' => $idCoach]);
        $nonDiponible = [];
        foreach ($reservations as $key => $reservation) {
            $dateStart = $reservation->getCommence();
            $dateEnd= $reservation->getFin();
            if (is_null($reservation->getDeletedAt())) {
                $nonDiponible[$dateStart->format('Y-m-d')] = ['start' => $dateStart->format('H:i'), 'end' => $dateEnd->format('H:i')];
            }
        }
        $disponible = [];
        $date = new \DateTime();
        $hourMin = 9;
        $hourMax = 21;
        for ($j=1; $j <= 14; $j++) { 
            for ($h=$hourMin; $h <=$hourMax ; $h++) { 
                //Si l'horaire n'est pas diponible
                $hourStart = $h.':00';
                $hourEnd = ($h+1).':00';
                if(isset($nonDiponible[$date->format('Y-m-d')]) &&  $hourStart >= $nonDiponible[$date->format('Y-m-d')]['start'] && $hourStart <= $nonDiponible[$date->format('Y-m-d')]['end'] || $hourMin < $hourStart || $hourMax < $hourEnd){
                    //On fait rien
                }
                else{
                    //Si l'horraire est disponible
                    $disponible[$date->format('Y-m-d')][] =  $hourStart." - ".$hourEnd ;
                }
            }
           $date->modify("+1 day");
        }
        $response = $serializer->serialize(
            $disponible, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/reservations/coach/{idCoach}', name: 'app_reservations_coach', methods:'GET')]
    public function reservationCoach($idCoach, ReservationRepository $reservationRepository, SerializerInterface $serializer): Response
    {
        $reservationsNonConfirm = $reservationRepository->findBy(['coach' => $idCoach, 'confirm' => 0, 'deleted_at' => NULL], ['commence' => 'ASC']);
        $reservationsConfirme = $reservationRepository->findBy(['coach' => $idCoach, 'confirm' => 1, 'deleted_at' => NULL], ['commence' => 'ASC']);
        $reservations = [
            'confirme' =>  $reservationsConfirme,
            'nonConfirme' =>  $reservationsNonConfirm
        ];
        $response = $serializer->serialize(
            $reservations, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/reservations/user/{idUser}', name: 'app_reservations_user')]
    public function reservationUser($idUser, ReservationRepository $reservationRepository, SerializerInterface $serializer): Response
    {
        $reservations = $reservationRepository->findBy(['coach' => $idUser]);
        $response = $serializer->serialize(
            $reservations, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/reservation/confirm', name: 'app_reservations_confirm', methods:'POST')]
    public function reservationConfirm(MailerInterface $mailer, Request $request, EntityManagerInterface $entityManager, ReservationRepository $reservationRepository, SerializerInterface $serializer): Response
    {
        $data = json_decode($request->getContent(), true);
        $reservation = $reservationRepository->findOneBy(['id' =>  $data['idReservation']]);
        $reservation->setConfirm(1);
        $entityManager->persist($reservation);
        $entityManager->flush();

        MailController::sendReservationConfirmation($mailer, $reservation->getUser()->getEmail(), $reservation, $reservation->getCoach());

        $response = $serializer->serialize(
            'Votre seance le '.$reservation->getCommence()->format('Y-m-d H:i').' à été confirmer', 
            'json'
        );

        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/reservation/decline', name: 'app_reservations_decline', methods:'POST')]
    public function reservationDecliner(MailerInterface $mailer, Request $request, EntityManagerInterface $entityManager, ReservationRepository $reservationRepository, SerializerInterface $serializer): Response
    {
        $data = json_decode($request->getContent(), true);
        $reservation = $reservationRepository->findOneBy(['id' =>  $data['idReservation']]);
        $reservation->setDeletedAt(new DateTime());
        $entityManager->persist($reservation);
        $entityManager->flush();

        MailController::sendReservationDecline($mailer, $reservation->getUser()->getEmail(), $reservation, $reservation->getCoach());

        $response = $serializer->serialize(
            'Votre seance le '.$reservation->getCommence()->format('Y-m-d H:i').' à été supprimer', 
            'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

}
