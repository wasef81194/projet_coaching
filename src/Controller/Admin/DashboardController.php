<?php

namespace App\Controller\Admin;

use App\Entity\Categorie;
use App\Entity\Ingredient;
use App\Entity\Programme;
use App\Entity\Recette;
use App\Entity\Reservation;
use App\Entity\Salle;
use App\Entity\User;
use App\Entity\Ville;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;

class DashboardController extends AbstractDashboardController
{
    #[Route('/moc_admin', name: 'admin')]
    public function index(): Response
    {
        // return parent::index();
        $routeBuilder = $this->container->get(AdminUrlGenerator::class);
        $url = $routeBuilder->setController(IngredientCrudController::class)->generateUrl();

        return $this->redirect($url);

        // Option 1. You can make your dashboard redirect to some common page of your backend
        //
        // $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);
        // return $this->redirect($adminUrlGenerator->setController(OneOfYourCrudController::class)->generateUrl());

        // Option 2. You can make your dashboard redirect to different pages depending on the user
        //
        // if ('jane' === $this->getUser()->getUsername()) {
        //     return $this->redirect('...');
        // }

        // Option 3. You can render some custom template to display a proper dashboard with widgets, etc.
        // (tip: it's easier if your template extends from @EasyAdmin/page/content.html.twig)
        //
        // return $this->render('some/path/my-dashboard.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Projet Coaching');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('My Online Coach', 'fa fa-home');
        yield MenuItem::linkToCrud('Ingredients', '', Ingredient::class);
        yield MenuItem::linkToCrud('Catégories', '', Categorie::class);
        yield MenuItem::linkToCrud('Recettes', '', Recette::class);
        yield MenuItem::linkToCrud('Programmes', '', Programme::class);
        yield MenuItem::linkToCrud('Reservations', '', Reservation::class);
        yield MenuItem::linkToCrud('Salles', '', Salle::class);
        yield MenuItem::linkToCrud('Villes', '', Ville::class);
    }
}
