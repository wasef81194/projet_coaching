<?php

namespace App\Controller\Admin;

use DateTime;
use App\Entity\Programme;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;

class ProgrammeCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Programme::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('name'),
            AssociationField::new('user'),
            AssociationField::new('recettes')->setFormTypeOption('by_reference', false),
            AssociationField::new('categories')->setFormTypeOption('by_reference', false),
            TextEditorField::new('description'),
            IntegerField::new('deleted_by')->hideOnForm(),
            // DateTimeField::new('deleted_at')->hideOnForm(),
            DateTimeField::new('ceated_at')->hideOnForm(),
        ];
    }
    
}
